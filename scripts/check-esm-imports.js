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

function isVarHoistTarget(node) {
  return (
    ts.isSourceFile(node) ||
    isFunctionLikeScope(node) ||
    ts.isClassStaticBlockDeclaration(node)
  );
}

function isScopeBoundary(node) {
  return (
    isVarHoistTarget(node) ||
    ts.isClassDeclaration(node) ||
    ts.isClassExpression(node) ||
    ts.isBlock(node) ||
    ts.isCaseBlock(node) ||
    ts.isCatchClause(node) ||
    ts.isForStatement(node) ||
    ts.isForInStatement(node) ||
    ts.isForOfStatement(node)
  );
}

const NO_GUARD = Object.freeze({ whenTrue: false, whenFalse: false });
const PRESENT_WHEN_TRUE = Object.freeze({ whenTrue: true, whenFalse: false });
const PRESENT_WHEN_FALSE = Object.freeze({ whenTrue: false, whenFalse: true });

function unwrapParentheses(expr) {
  let current = expr;
  while (current && ts.isParenthesizedExpression(current)) {
    current = current.expression;
  }
  return current;
}

function unwrapUpwardValueWrappers(node) {
  let current = node;
  while (current && current.parent) {
    if (ts.isParenthesizedExpression(current.parent)) {
      current = current.parent;
    } else if (
      ts.isBinaryExpression(current.parent) &&
      current.parent.operatorToken.kind === ts.SyntaxKind.CommaToken &&
      current.parent.right === current
    ) {
      current = current.parent;
    } else {
      break;
    }
  }
  return current;
}

function isRawGlobalObjectIdentifier(expr) {
  const target = unwrapParentheses(expr);
  return Boolean(target && ts.isIdentifier(target) && globalObjectNames.has(target.text));
}

function isRawGlobalBufferAccess(expr) {
  const target = unwrapParentheses(expr);
  if (!target) {
    return false;
  }
  if (
    ts.isPropertyAccessExpression(target) &&
    isRawGlobalObjectIdentifier(target.expression) &&
    target.name.text === 'Buffer'
  ) {
    return true;
  }
  if (
    ts.isElementAccessExpression(target) &&
    isRawGlobalObjectIdentifier(target.expression) &&
    target.argumentExpression &&
    ts.isStringLiteral(target.argumentExpression) &&
    target.argumentExpression.text === 'Buffer'
  ) {
    return true;
  }
  return false;
}

function isInsideParameterOf(node, fnNode) {
  let current = node;
  while (current && current !== fnNode) {
    if (ts.isParameter(current) && current.parent === fnNode) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

function createScopeAnalyzer() {
  const scopeCache = new WeakMap();
  const visitingInitializers = new Set();

  function getScopeInfo(scopeNode) {
    const cached = scopeCache.get(scopeNode);
    if (cached) {
      return cached;
    }

    const headerBindings = new Set();
    const bodyBindings = new Set();
    const constInitializers = new Map();
    const globalBufferAliases = new Set();

    if (
      (ts.isFunctionExpression(scopeNode) || ts.isClassExpression(scopeNode)) &&
      scopeNode.name &&
      ts.isIdentifier(scopeNode.name)
    ) {
      headerBindings.add(scopeNode.name.text);
    }

    if (isFunctionLikeScope(scopeNode)) {
      for (const param of scopeNode.parameters) {
        collectBoundNames(param.name, headerBindings);
      }
    }

    if (ts.isCatchClause(scopeNode) && scopeNode.variableDeclaration) {
      collectBoundNames(scopeNode.variableDeclaration.name, headerBindings);
    }

    const processDeclarationList = (declList, allowBlockScoped) => {
      const isVar = (declList.flags & ts.NodeFlags.BlockScoped) === 0;
      const isConst = (declList.flags & ts.NodeFlags.Const) !== 0;
      if (!(isVar ? isVarHoistTarget(scopeNode) : allowBlockScoped)) {
        return;
      }

      for (const decl of declList.declarations) {
        if (
          ts.isIdentifier(decl.name) &&
          decl.initializer &&
          isRawGlobalBufferAccess(decl.initializer)
        ) {
          globalBufferAliases.add(decl.name.text);
        } else if (
          ts.isObjectBindingPattern(decl.name) &&
          decl.initializer &&
          isRawGlobalObjectIdentifier(decl.initializer)
        ) {
          for (const element of decl.name.elements) {
            if (ts.isBindingElement(element) && !element.dotDotDotToken && ts.isIdentifier(element.name)) {
              const keyNode = element.propertyName ?? element.name;
              const keyName =
                ts.isIdentifier(keyNode) || ts.isStringLiteral(keyNode) ? keyNode.text : null;
              if (keyName === 'Buffer') {
                globalBufferAliases.add(element.name.text);
              }
            }
          }
        }

        collectBoundNames(decl.name, bodyBindings);
        if (isConst && ts.isIdentifier(decl.name) && decl.initializer) {
          constInitializers.set(decl.name.text, decl.initializer);
        }
      }
    };

    const visitDirectChild = (child) => {
      if (ts.isImportDeclaration(child) && child.importClause) {
        const { name, namedBindings } = child.importClause;
        if (name) {
          bodyBindings.add(name.text);
        }
        if (namedBindings) {
          if (ts.isNamespaceImport(namedBindings)) {
            bodyBindings.add(namedBindings.name.text);
          } else if (ts.isNamedImports(namedBindings)) {
            for (const element of namedBindings.elements) {
              bodyBindings.add(element.name.text);
            }
          }
        }
      } else if (ts.isFunctionDeclaration(child) || ts.isClassDeclaration(child)) {
        if (child.name) {
          bodyBindings.add(child.name.text);
        }
      } else if (ts.isVariableStatement(child)) {
        processDeclarationList(child.declarationList, true);
      } else if (ts.isVariableDeclarationList(child)) {
        processDeclarationList(child, true);
      }
    };

    const visitHoistedInSubtree = (subtree) => {
      ts.forEachChild(subtree, (child) => {
        if (isVarHoistTarget(child)) {
          return;
        }
        if (ts.isFunctionDeclaration(child) && child.name) {
          bodyBindings.add(child.name.text);
        } else if (ts.isVariableStatement(child)) {
          processDeclarationList(child.declarationList, false);
        } else if (ts.isVariableDeclarationList(child)) {
          processDeclarationList(child, false);
        }
        visitHoistedInSubtree(child);
      });
    };

    if (ts.isCaseBlock(scopeNode)) {
      for (const clause of scopeNode.clauses) {
        for (const stmt of clause.statements) {
          visitDirectChild(stmt);
        }
      }
    } else {
      ts.forEachChild(scopeNode, visitDirectChild);
    }

    if (isVarHoistTarget(scopeNode)) {
      if (isFunctionLikeScope(scopeNode)) {
        if (scopeNode.body) {
          visitHoistedInSubtree(scopeNode.body);
        }
      } else {
        visitHoistedInSubtree(scopeNode);
      }
    }

    const info = {
      headerBindings,
      bodyBindings,
      constInitializers,
      globalBufferAliases,
    };
    scopeCache.set(scopeNode, info);
    return info;
  }

  function resolveBinding(node, name) {
    let current = node;
    while (current) {
      if (isScopeBoundary(current)) {
        const info = getScopeInfo(current);
        const inParam = isFunctionLikeScope(current) && isInsideParameterOf(node, current);
        if (!inParam && info.bodyBindings.has(name)) {
          let isGlobalAlias = info.globalBufferAliases.has(name);
          if (isGlobalAlias) {
            const init = info.constInitializers.get(name);
            if (init) {
              const target = unwrapParentheses(init);
              const baseIdent =
                target && (ts.isPropertyAccessExpression(target) || ts.isElementAccessExpression(target))
                  ? unwrapParentheses(target.expression)
                  : target;
              if (baseIdent && ts.isIdentifier(baseIdent) && isNameBoundAt(baseIdent, baseIdent.text)) {
                isGlobalAlias = false;
              }
            }
          }
          return {
            scopeNode: current,
            isGlobalBufferAlias: isGlobalAlias,
            constInitializer: info.constInitializers.get(name) ?? null,
          };
        }
        if (info.headerBindings.has(name)) {
          return {
            scopeNode: current,
            isGlobalBufferAlias: false,
            constInitializer: null,
          };
        }
      }
      current = current.parent;
    }
    return null;
  }

  function isNameBoundAt(node, name) {
    return Boolean(resolveBinding(node, name));
  }

  function hasSafeBufferInScope(node) {
    const binding = resolveBinding(node, 'Buffer');
    return Boolean(binding && !binding.isGlobalBufferAlias);
  }

  function isUnshadowedGlobalObject(expr) {
    const target = unwrapParentheses(expr);
    return Boolean(
      target &&
        ts.isIdentifier(target) &&
        globalObjectNames.has(target.text) &&
        !isNameBoundAt(target, target.text)
    );
  }

  function isGlobalBufferAccess(expr) {
    const target = unwrapParentheses(expr);
    if (!target) {
      return false;
    }
    if (
      ts.isPropertyAccessExpression(target) &&
      isUnshadowedGlobalObject(target.expression) &&
      target.name.text === 'Buffer'
    ) {
      return true;
    }
    if (
      ts.isElementAccessExpression(target) &&
      isUnshadowedGlobalObject(target.expression) &&
      target.argumentExpression &&
      ts.isStringLiteral(target.argumentExpression) &&
      target.argumentExpression.text === 'Buffer'
    ) {
      return true;
    }
    return false;
  }

  function isBufferReference(expr) {
    const target = unwrapParentheses(expr);
    if (!target) {
      return false;
    }
    if (ts.isIdentifier(target)) {
      if (target.text === 'Buffer' && !hasSafeBufferInScope(target)) {
        return true;
      }
      const binding = resolveBinding(target, target.text);
      return Boolean(binding && binding.isGlobalBufferAlias);
    }
    return isGlobalBufferAccess(target);
  }

  function isUndefinedCheckLiteral(node, isStrict) {
    const target = unwrapParentheses(node);
    if (!target) {
      return false;
    }
    if (ts.isIdentifier(target) && target.text === 'undefined' && !isNameBoundAt(target, 'undefined')) {
      return true;
    }
    if (ts.isVoidExpression(target)) {
      return true;
    }
    if (!isStrict && target.kind === ts.SyntaxKind.NullKeyword) {
      return true;
    }
    return false;
  }

  function matchTypeOfBufferComparison(left, right, isInequality) {
    const leftTarget = unwrapParentheses(left);
    const rightTarget = unwrapParentheses(right);
    if (
      !leftTarget ||
      !rightTarget ||
      !ts.isTypeOfExpression(leftTarget) ||
      !ts.isStringLiteral(rightTarget) ||
      !isBufferReference(leftTarget.expression)
    ) {
      return null;
    }

    if (rightTarget.text === 'undefined') {
      return isInequality ? PRESENT_WHEN_TRUE : PRESENT_WHEN_FALSE;
    }
    if (rightTarget.text === 'function') {
      return isInequality ? PRESENT_WHEN_FALSE : PRESENT_WHEN_TRUE;
    }
    return NO_GUARD;
  }

  function evaluateBufferGuard(rawExpr) {
    const expr = unwrapParentheses(rawExpr);
    if (!expr) {
      return NO_GUARD;
    }
    if (ts.isIdentifier(expr)) {
      const binding = resolveBinding(expr, expr.text);
      if (!binding) {
        return NO_GUARD;
      }
      if (binding.isGlobalBufferAlias) {
        return PRESENT_WHEN_TRUE;
      }
      if (binding.constInitializer && !visitingInitializers.has(binding.constInitializer)) {
        visitingInitializers.add(binding.constInitializer);
        try {
          return evaluateBufferGuard(binding.constInitializer);
        } finally {
          visitingInitializers.delete(binding.constInitializer);
        }
      }
      return NO_GUARD;
    }
    if (isGlobalBufferAccess(expr)) {
      return PRESENT_WHEN_TRUE;
    }
    if (ts.isPrefixUnaryExpression(expr) && expr.operator === ts.SyntaxKind.ExclamationToken) {
      const inner = evaluateBufferGuard(expr.operand);
      return { whenTrue: inner.whenFalse, whenFalse: inner.whenTrue };
    }
    if (
      ts.isCallExpression(expr) &&
      ts.isIdentifier(expr.expression) &&
      expr.expression.text === 'Boolean' &&
      !isNameBoundAt(expr.expression, 'Boolean') &&
      expr.arguments.length === 1
    ) {
      return evaluateBufferGuard(expr.arguments[0]);
    }
    if (ts.isBinaryExpression(expr)) {
      const op = expr.operatorToken.kind;
      if (op === ts.SyntaxKind.AmpersandAmpersandToken) {
        const left = evaluateBufferGuard(expr.left);
        const right = evaluateBufferGuard(expr.right);
        return {
          whenTrue: left.whenTrue || right.whenTrue,
          whenFalse: left.whenFalse && right.whenFalse,
        };
      }
      if (op === ts.SyntaxKind.BarBarToken) {
        const left = evaluateBufferGuard(expr.left);
        const right = evaluateBufferGuard(expr.right);
        return {
          whenTrue: left.whenTrue && right.whenTrue,
          whenFalse: left.whenFalse || right.whenFalse,
        };
      }
      if (
        op === ts.SyntaxKind.ExclamationEqualsToken ||
        op === ts.SyntaxKind.ExclamationEqualsEqualsToken ||
        op === ts.SyntaxKind.EqualsEqualsToken ||
        op === ts.SyntaxKind.EqualsEqualsEqualsToken
      ) {
        const isInequality =
          op === ts.SyntaxKind.ExclamationEqualsToken ||
          op === ts.SyntaxKind.ExclamationEqualsEqualsToken;
        const isStrict =
          op === ts.SyntaxKind.EqualsEqualsEqualsToken ||
          op === ts.SyntaxKind.ExclamationEqualsEqualsToken;

        const typeOfMatch =
          matchTypeOfBufferComparison(expr.left, expr.right, isInequality) ??
          matchTypeOfBufferComparison(expr.right, expr.left, isInequality);
        if (typeOfMatch) {
          return typeOfMatch;
        }

        const leftIsNonBareBuffer =
          isGlobalBufferAccess(expr.left) ||
          (ts.isIdentifier(unwrapParentheses(expr.left)) &&
            Boolean(resolveBinding(unwrapParentheses(expr.left), unwrapParentheses(expr.left).text)?.isGlobalBufferAlias));
        const rightIsNonBareBuffer =
          isGlobalBufferAccess(expr.right) ||
          (ts.isIdentifier(unwrapParentheses(expr.right)) &&
            Boolean(resolveBinding(unwrapParentheses(expr.right), unwrapParentheses(expr.right).text)?.isGlobalBufferAlias));

        if (
          (leftIsNonBareBuffer && isUndefinedCheckLiteral(expr.right, isStrict)) ||
          (rightIsNonBareBuffer && isUndefinedCheckLiteral(expr.left, isStrict))
        ) {
          return isInequality ? PRESENT_WHEN_TRUE : PRESENT_WHEN_FALSE;
        }
      }
    }
    return NO_GUARD;
  }

  function isInsideBufferGuard(node) {
    let current = node;
    let crossedHoistedFunction = false;
    while (current && current.parent) {
      if (ts.isFunctionDeclaration(current)) {
        crossedHoistedFunction = true;
      }
      const parent = current.parent;
      if (ts.isConditionalExpression(parent)) {
        if (parent.whenTrue === current && evaluateBufferGuard(parent.condition).whenTrue) {
          return true;
        }
        if (parent.whenFalse === current && evaluateBufferGuard(parent.condition).whenFalse) {
          return true;
        }
      } else if (ts.isIfStatement(parent)) {
        if (parent.thenStatement === current && evaluateBufferGuard(parent.expression).whenTrue) {
          return true;
        }
        if (parent.elseStatement === current && evaluateBufferGuard(parent.expression).whenFalse) {
          return true;
        }
      } else if (ts.isWhileStatement(parent) && parent.statement === current) {
        if (evaluateBufferGuard(parent.expression).whenTrue) {
          return true;
        }
      } else if (
        ts.isForStatement(parent) &&
        parent.statement === current &&
        parent.condition &&
        evaluateBufferGuard(parent.condition).whenTrue
      ) {
        return true;
      } else if (ts.isBinaryExpression(parent) && parent.right === current) {
        if (
          parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
          evaluateBufferGuard(parent.left).whenTrue
        ) {
          return true;
        }
        if (
          parent.operatorToken.kind === ts.SyntaxKind.BarBarToken &&
          evaluateBufferGuard(parent.left).whenFalse
        ) {
          return true;
        }
      } else if (
        !crossedHoistedFunction &&
        (ts.isBlock(parent) || ts.isSourceFile(parent)) &&
        parent.statements
      ) {
        for (const sibling of parent.statements) {
          if (sibling === current) {
            break;
          }
          if (
            ts.isIfStatement(sibling) &&
            !sibling.elseStatement &&
            statementAlwaysExits(sibling.thenStatement) &&
            evaluateBufferGuard(sibling.expression).whenFalse
          ) {
            return true;
          }
        }
      }
      current = parent;
    }
    return false;
  }

  return {
    resolveBinding,
    hasSafeBufferInScope,
    isGlobalBufferAccess,
    isInsideBufferGuard,
  };
}

function statementAlwaysExits(stmt) {
  if (!stmt) {
    return false;
  }
  if (
    ts.isReturnStatement(stmt) ||
    ts.isThrowStatement(stmt) ||
    ts.isBreakStatement(stmt) ||
    ts.isContinueStatement(stmt)
  ) {
    return true;
  }
  if (ts.isBlock(stmt) && stmt.statements.length > 0) {
    return statementAlwaysExits(stmt.statements[stmt.statements.length - 1]);
  }
  return false;
}

function isDirectTypeOfOperand(node) {
  let current = node;
  while (current.parent && ts.isParenthesizedExpression(current.parent)) {
    current = current.parent;
  }
  return Boolean(
    current.parent &&
      ts.isTypeOfExpression(current.parent) &&
      current.parent.expression === current
  );
}

function isGlobalBufferDereferenceOrCall(accessNode) {
  const unwrapped = unwrapUpwardValueWrappers(accessNode);
  const outer = unwrapped.parent;
  if (!outer) {
    return false;
  }
  if (ts.isPropertyAccessExpression(outer) && outer.expression === unwrapped) {
    return !outer.questionDotToken;
  }
  if (ts.isElementAccessExpression(outer) && outer.expression === unwrapped) {
    return !outer.questionDotToken;
  }
  if (ts.isCallExpression(outer) && outer.expression === unwrapped) {
    return !outer.questionDotToken;
  }
  if (ts.isNewExpression(outer) && outer.expression === unwrapped) {
    return true;
  }
  if (
    ts.isVariableDeclaration(outer) &&
    outer.initializer === unwrapped &&
    ts.isObjectBindingPattern(outer.name)
  ) {
    return true;
  }
  return false;
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
      ts.isPropertyAssignment(parent) ||
      ts.isMethodDeclaration(parent) ||
      ts.isPropertyDeclaration(parent) ||
      ts.isGetAccessorDeclaration(parent) ||
      ts.isSetAccessorDeclaration(parent) ||
      ts.isImportClause(parent) ||
      ts.isNamespaceImport(parent)) &&
      parent.name === node) ||
    (ts.isBindingElement(parent) && (parent.name === node || parent.propertyName === node)) ||
    (ts.isImportSpecifier(parent) && (parent.name === node || parent.propertyName === node)) ||
    (ts.isExportSpecifier(parent) &&
      parent.parent &&
      parent.parent.parent &&
      ts.isExportDeclaration(parent.parent.parent) &&
      Boolean(parent.parent.parent.moduleSpecifier))
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
  const analyzer = createScopeAnalyzer();

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

  const recordBufferFinding = (statementText) => {
    findings.push({
      filePath,
      packageName: 'Buffer',
      importStatement: statementText,
      reason:
        'unguarded global Buffer usage in built ESM bundle without a local Buffer binding breaks browsers',
    });
  };

  const visit = (node) => {
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
      (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) &&
      analyzer.isGlobalBufferAccess(node) &&
      isGlobalBufferDereferenceOrCall(node) &&
      !analyzer.isInsideBufferGuard(node)
    ) {
      const unwrapped = unwrapUpwardValueWrappers(node);
      recordBufferFinding(unwrapped.parent.getText(sourceFile));
    } else if (ts.isIdentifier(node) && !isDeclarationName(node)) {
      const parent = node.parent;
      const isPropertyName =
        parent && ts.isPropertyAccessExpression(parent) && parent.name === node;

      if (!isPropertyName) {
        if (node.text === 'Buffer') {
          if (
            !analyzer.hasSafeBufferInScope(node) &&
            !isDirectTypeOfOperand(node) &&
            !analyzer.isInsideBufferGuard(node)
          ) {
            const unwrapped = unwrapUpwardValueWrappers(node);
            const outer = unwrapped.parent;
            const statementText =
              outer && (ts.isPropertyAccessExpression(outer) || ts.isCallExpression(outer))
                ? outer.getText(sourceFile)
                : node.getText(sourceFile);
            recordBufferFinding(statementText);
          }
        } else {
          const binding = analyzer.resolveBinding(node, node.text);
          if (
            binding &&
            binding.isGlobalBufferAlias &&
            isGlobalBufferDereferenceOrCall(node) &&
            !analyzer.isInsideBufferGuard(node)
          ) {
            const unwrapped = unwrapUpwardValueWrappers(node);
            recordBufferFinding(unwrapped.parent.getText(sourceFile));
          }
        }
      }
    }

    ts.forEachChild(node, visit);
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
