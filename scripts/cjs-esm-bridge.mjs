import { writeFileSync } from 'node:fs';
import { basename, dirname, relative, resolve, sep } from 'node:path';

function moduleSpecifier(target, source) {
  return JSON.stringify(`./${relative(dirname(target), resolve(source)).split(sep).join('/')}`);
}

/** Share instances in native Node, and expose static exports to bundlers. */
export function cjsEsmBridge(pkg) {
  return {
    name: 'cjs-esm-bridge',
    writeBundle(options, bundle) {
      if (options.format === 'es') {
        const target = resolve(pkg.exports['.'].module);
        const specifier = moduleSpecifier(target, pkg.module);
        writeFileSync(
          target,
          `import * as namespace from ${specifier};\nexport * from ${specifier};\nexport default namespace;\n`
        );
        return;
      }
      if (options.format !== 'cjs') return;
      const entry = bundle[basename(pkg.main)];
      if (!entry || entry.type !== 'chunk' || !entry.isEntry) {
        throw new Error(`Missing CommonJS entry chunk: ${pkg.main}`);
      }
      const target = resolve(pkg.exports['.'].import);
      const specifier = moduleSpecifier(target, pkg.main);
      const declarations = entry.exports
        .filter((name) => name !== 'default')
        .map(
          (name, index) =>
            `const namedExport${index} = commonjs[${JSON.stringify(name)}];\nexport { namedExport${index} as ${JSON.stringify(name)} };`
        );
      writeFileSync(
        target,
        [
          `import commonjs from ${specifier};`,
          'export default commonjs;',
          "export { commonjs as 'module.exports' };",
          ...declarations,
          '',
        ].join('\n')
      );
    },
  };
}
