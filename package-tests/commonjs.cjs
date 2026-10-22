/* eslint-disable @typescript-eslint/no-var-requires -- These consumers verify CommonJS require. */
const checkConsumer = require('./runtime.cjs');
checkConsumer(require('@taquito/core'), require('@taquito/http-utils')).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
