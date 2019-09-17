module.exports = {
  mode: 'modules',
  out: 'dist/typedoc',
  exclude: [
    'integration-tests/**/*.ts',
    'example/**/*.ts',
    '**/data/**',
    '**/test/**',
    '**/rollup*.ts',
    '**/dist/**',
    '**/node_modules/**',
    '**/*.spec.ts'
  ],
  name: 'Tezos TS',
  excludePrivate: true,
  skipInternal: true
};
