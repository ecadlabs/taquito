import { writeFileSync } from 'node:fs';
import { basename, dirname, relative, resolve, sep } from 'node:path';

/** Keep native ESM imports on the same CommonJS instances as require(). */
export function cjsEsmBridge(pkg) {
  return {
    name: 'cjs-esm-bridge',
    writeBundle(options, bundle) {
      if (options.format !== 'cjs') return;
      const entry = bundle[basename(pkg.main)];
      if (!entry || entry.type !== 'chunk' || !entry.isEntry) {
        throw new Error(`Missing CommonJS entry chunk: ${pkg.main}`);
      }
      const target = resolve(pkg.exports['.'].import);
      const specifier = `./${relative(dirname(target), resolve(pkg.main)).split(sep).join('/')}`;
      const declarations = entry.exports
        .filter((name) => name !== 'default')
        .map(
          (name, index) =>
            `const namedExport${index} = commonjs[${JSON.stringify(name)}];\nexport { namedExport${index} as ${JSON.stringify(name)} };`
        );
      writeFileSync(
        target,
        [
          `import commonjs from ${JSON.stringify(specifier)};`,
          'export default commonjs;',
          "export { commonjs as 'module.exports' };",
          ...declarations,
          '',
        ].join('\n')
      );
    },
  };
}
