module.exports = {
  mode: 'modules',
  out: 'dist/typedoc',
  readme: 'packages/taquito/README.md',
  exclude: [
    '**/*.spec.ts',
    '**/data/**',
    '**/dist/**',
    '**/node_modules/**',
    '**/rollup*.ts',
    '**/test/**',
    'example/**/*.ts',
    'integration-tests/**/*.ts',
    'packages/taquito-michel-codec/formatter/*.ts',
    'packages/taquito/example',
    'packages/taquito/website',
    'website/**/*',
  ],
  lernaExclude: [],
  name: 'Taquito',
  excludePrivate: true,
  excludeNotExported: true
};
