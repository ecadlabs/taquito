const { readdirSync, readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');
const ts = require('typescript');

const repoRoot = resolve(__dirname, '..');
const packagesDir = join(repoRoot, 'packages');

const forbiddenModuleReasons = new Map([
  [
    'typedarray-to-buffer',
    'typedarray-to-buffer relies on an unpolyfilled global Buffer and is not safe in browser ESM bundles',
  ],
  [
    'fast-text-encoding',
    'fast-text-encoding is a legacy side-effect polyfill and is not needed in modern JS environments',
  ],
]);

const globalObjectNames = new Set(['globalThis', 'window', 'self', 'global']);

function findBuiltEsmFiles(rootDir = packagesDir) {
  return readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(rootDir, entry.name, 'dist'))
    .flatMap((distDir) => {
      try {
        return readdirSync(distDir)
          .filter((fileName) => fileName.endsWith('.es6.js'))
          .map((fileName) => join(distDir, fileName));
      } catch {
        return [];
      }
    });
}

function collectBoundNames(nameNode, targetSet) {
  if (!nameNode) {
    return;
  }
  if (ts.isIdentifier(nameNode)) {
    targetSet.add(nameNode.text);
  } else if (ts.isObjectBindingPattern(nameNode) || ts.isArrayBindingPattern(nameNode)) {
    for (const element of nameNode.elements) {
      if (ts.isBindingElement(element)) {
        collectBoundNames(element.name, targetSet);
      }
    }
  }
}

function isScopeBoundary(node) {
  return (
    ts.isSourceFile(node) ||
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isConstructorDeclaration(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node) ||
    ts.isBlock(node) ||
    ts.isCatchClause(node) ||
    ts.isForStatement(node) ||
    ts.isForInStatement(node) ||
    ts.isForOfStatement(node)
  );
}

function collectScopeBindings(node, sourceFile) {
  const bindings = new Set();

  if (
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isConstructorDeclaration(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node)
  ) {
    if (node.name && ts.isIdentifier(node.name)) {
      bindings.add(node.name.text);
    }
    for (const param of node.parameters) {
      collectBoundNames(param.name, bindings);
    }
  }

  if (ts.isCatchClause(node) && node.variableDeclaration) {
    collectBoundNames(node.variableDeclaration.name, bindings);
  }

  const visitHoistedOrLexical = (child) => {
    if (ts.isImportDeclaration(child) && child.importClause) {
      const { name, namedBindings } = child.importClause;
      if (name) {
        bindings.add(name.text);
      }
      if (namedBindings) {
        if (ts.isNamespaceImport(namedBindings)) {
          bindings.add(namedBindings.name.text);
        } else if (ts.isNamedImports(namedBindings)) {
          for (const element of namedBindings.elements) {
            bindings.add(element.name.text);
          }
        }
      }
    } else if (ts.isFunctionDeclaration(child) || ts.isClassDeclaration(child)) {
      if (child.name) {
        bindings.add(child.name.text);
      }
    } else if (ts.isVariableStatement(child)) {
      const isVar = (child.declarationList.flags & ts.NodeFlags.BlockScoped) === 0;
      if (isVar ? ts.isSourceFile(node) || isFunctionLikeScope(node) : true) {
        for (const decl of child.declarationList.declarations) {
          collectBoundNames(decl.name, bindings);
        }
      }
    } else if (ts.isVariableDeclarationList(child)) {
      const isVar = (child.flags & ts.NodeFlags.BlockScoped) === 0;
      if (isVar ? ts.isSourceFile(node) || isFunctionLikeScope(node) : true) {
        for (const decl of child.declarations) {
          collectBoundNames(decl.name, bindings);
        }
      }
    }

    if (ts.isSourceFile(node) || isFunctionLikeScope(node)) {
      ts.forEachChild(child, (grandChild) => {
        if (!isFunctionLikeScope(grandChild)) {
          visitHoistedDeclarations(grandChild, bindings);
        }
      });
    }
  };

  ts.forEachChild(node, visitHoistedOrLexical);
  void sourceFile;
  return bindings;
}

function isFunctionLikeScope(node) {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isConstructorDeclaration(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node)
  );
}

function visitHoistedDeclarations(node, bindings) {
  if (ts.isFunctionDeclaration(node) && node.name) {
    bindings.add(node.name.text);
  } else if (ts.isVariableStatement(node)) {
    const isVar = (node.declarationList.flags & ts.NodeFlags.BlockScoped) === 0;
    if (isVar) {
      for (const decl of node.declarationList.declarations) {
        collectBoundNames(decl.name, bindings);
      }
    }
  } else if (ts.isVariableDeclarationList(node)) {
    const isVar = (node.flags & ts.NodeFlags.BlockScoped) === 0;
    if (isVar) {
      for (const decl of node.declarations) {
        collectBoundNames(decl.name, bindings);
      }
    }
  }
  ts.forEachChild(node, (child) => {
    if (!isFunctionLikeScope(child)) {
      visitHoistedDeclarations(child, bindings);
    }
  });
}

function isBufferReference(expr) {
  if (ts.isIdentifier(expr) && expr.text === 'Buffer') {
    return true;
  }
  if (
    ts.isPropertyAccessExpression(expr) &&
    ts.isIdentifier(expr.expression) &&
    globalObjectNames.has(expr.expression.text) &&
    expr.name.text === 'Buffer'
  ) {
    return true;
  }
  return false;
}

function expressionGuardsBuffer(expr, guardIdentifiers = new Set()) {
  if (!expr) {
    return false;
  }
  if (ts.isParenthesizedExpression(expr)) {
    return expressionGuardsBuffer(expr.expression, guardIdentifiers);
  }
  if (ts.isIdentifier(expr) && guardIdentifiers.has(expr.text)) {
    return true;
  }
  if (isBufferReference(expr)) {
    return true;
  }
  if (
    ts.isPropertyAccessExpression(expr) &&
    isBufferReference(expr.expression)
  ) {
    return true;
  }
  if (
    ts.isCallExpression(expr) &&
    ts.isPropertyAccessExpression(expr.expression) &&
    isBufferReference(expr.expression.expression)
  ) {
    return true;
  }
  if (ts.isTypeOfExpression(expr) && expressionGuardsBuffer(expr.expression, guardIdentifiers)) {
    return true;
  }
  if (ts.isBinaryExpression(expr)) {
    if (
      expr.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
      expr.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsToken ||
      expr.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken ||
      expr.operatorToken.kind === ts.SyntaxKind.EqualsEqualsToken ||
      expr.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken
    ) {
      return (
        expressionGuardsBuffer(expr.left, guardIdentifiers) ||
        expressionGuardsBuffer(expr.right, guardIdentifiers)
      );
    }
  }
  return false;
}

function isInsideBufferGuard(node, guardIdentifiers = new Set()) {
  let current = node;
  while (current && current.parent) {
    const parent = current.parent;
    if (ts.isTypeOfExpression(parent) && parent.expression === current) {
      return true;
    }
    if (
      ts.isConditionalExpression(parent) &&
      parent.whenTrue === current &&
      expressionGuardsBuffer(parent.condition, guardIdentifiers)
    ) {
      return true;
    }
    if (
      ts.isIfStatement(parent) &&
      parent.thenStatement === current &&
      expressionGuardsBuffer(parent.expression, guardIdentifiers)
    ) {
      return true;
    }
    if (
      ts.isBinaryExpression(parent) &&
      parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
      parent.right === current &&
      expressionGuardsBuffer(parent.left, guardIdentifiers)
    ) {
      return true;
    }
    current = parent;
  }
  return false;
}

function isGlobalBufferDereferenceOrCall(propAccess) {
  const outer = propAccess.parent;
  if (!outer) {
    return false;
  }
  return (
    (ts.isPropertyAccessExpression(outer) && outer.expression === propAccess) ||
    (ts.isElementAccessExpression(outer) && outer.expression === propAccess) ||
    (ts.isCallExpression(outer) && outer.expression === propAccess) ||
    (ts.isNewExpression(outer) && outer.expression === propAccess)
  );
}
function isDeclarationName(node) {
  const parent = node.parent;
  if (!parent) {
    return false;
  }
  return (
    ((ts.isFunctionDeclaration(parent) ||
      ts.isFunctionExpression(parent) ||
      ts.isClassDeclaration(parent) ||
      ts.isClassExpression(parent) ||
      ts.isVariableDeclaration(parent) ||
      ts.isParameter(parent) ||
      ts.isBindingElement(parent) ||
      ts.isPropertyAssignment(parent) ||
      ts.isShorthandPropertyAssignment(parent) ||
      ts.isMethodDeclaration(parent) ||
      ts.isPropertyDeclaration(parent) ||
      ts.isImportClause(parent) ||
      ts.isNamespaceImport(parent)) &&
      parent.name === node) ||
    (ts.isImportSpecifier(parent) && (parent.name === node || parent.propertyName === node)) ||
    (ts.isExportSpecifier(parent) && (parent.name === node || parent.propertyName === node))
  );
}

function findForbiddenImports(filePath, source) {
  const findings = [];
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS
  );
  const scopeStack = [];
  const guardIdentifiers = new Set();

  const hasBufferInScope = () => scopeStack.some((scope) => scope.has('Buffer'));

  const recordModuleSpecifierFinding = (specifierText, statementNode) => {
    const reason = forbiddenModuleReasons.get(specifierText);
    if (reason) {
      findings.push({
        filePath,
        packageName: specifierText,
        importStatement: statementNode.getText(sourceFile),
        reason,
      });
    }
  };

  const visit = (node) => {
    const pushedScope = isScopeBoundary(node);
    if (pushedScope) {
      scopeStack.push(collectScopeBindings(node, sourceFile));
    }

    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const specifier = node.moduleSpecifier.text;
      if (
        specifier === 'bignumber.js' &&
        node.importClause &&
        node.importClause.namedBindings &&
        ts.isNamedImports(node.importClause.namedBindings) &&
        node.importClause.namedBindings.elements.length > 0
      ) {
        findings.push({
          filePath,
          packageName: 'bignumber.js',
          importStatement: node.getText(sourceFile),
          reason: 'named imports from bignumber.js are not safe in published browser ESM bundles',
        });
      }
      recordModuleSpecifierFinding(specifier, node);
    } else if (
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      recordModuleSpecifierFinding(node.moduleSpecifier.text, node);
    } else if (ts.isCallExpression(node)) {
      if (
        node.arguments.length >= 1 &&
        ts.isStringLiteral(node.arguments[0]) &&
        ((ts.isIdentifier(node.expression) && node.expression.text === 'require') ||
          node.expression.kind === ts.SyntaxKind.ImportKeyword)
      ) {
        recordModuleSpecifierFinding(node.arguments[0].text, node);
      }
    }

    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      expressionGuardsBuffer(node.initializer, guardIdentifiers)
    ) {
      guardIdentifiers.add(node.name.text);
    }

    if (ts.isIdentifier(node) && node.text === 'Buffer' && !isDeclarationName(node)) {
      const parent = node.parent;
      const isPropertyName =
        parent && ts.isPropertyAccessExpression(parent) && parent.name === node;

      if (isPropertyName) {
        if (
          ts.isIdentifier(parent.expression) &&
          globalObjectNames.has(parent.expression.text) &&
          isGlobalBufferDereferenceOrCall(parent) &&
          !isInsideBufferGuard(parent, guardIdentifiers)
        ) {
          const statementText = parent.parent.getText(sourceFile);
          findings.push({
            filePath,
            packageName: 'Buffer',
            importStatement: statementText,
            reason:
              'unguarded global Buffer usage in built ESM bundle without a local Buffer binding breaks browsers',
          });
        }
      } else if (!hasBufferInScope() && !isInsideBufferGuard(node, guardIdentifiers)) {
        const statementText =
          parent && (ts.isPropertyAccessExpression(parent) || ts.isCallExpression(parent))
            ? parent.getText(sourceFile)
            : node.getText(sourceFile);
        findings.push({
          filePath,
          packageName: 'Buffer',
          importStatement: statementText,
          reason:
            'unguarded global Buffer usage in built ESM bundle without a local Buffer binding breaks browsers',
        });
      }
    }

    ts.forEachChild(node, visit);

    if (pushedScope) {
      scopeStack.pop();
    }
  };

  visit(sourceFile);
  return findings;
}

function checkBuiltEsmImports(rootDir = packagesDir) {
  return findBuiltEsmFiles(rootDir).flatMap((filePath) =>
    findForbiddenImports(filePath, readFileSync(filePath, 'utf8'))
  );
}

function formatFinding(finding) {
  const relativePath = finding.filePath.startsWith(repoRoot)
    ? finding.filePath.slice(repoRoot.length + 1)
    : finding.filePath;

  return `${relativePath}\n  ${finding.importStatement}\n  ${finding.reason}`;
}

if (require.main === module) {
  const findings = checkBuiltEsmImports();

  if (findings.length > 0) {
    console.error('Forbidden ESM import shape found in built artifacts:\n');
    for (const finding of findings) {
      console.error(formatFinding(finding));
    }
    process.exit(1);
  }

  console.log('Built ESM import checks passed.');
}

module.exports = {
  checkBuiltEsmImports,
  findBuiltEsmFiles,
  findForbiddenImports,
  formatFinding,
};
