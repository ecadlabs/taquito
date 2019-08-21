const path = require('path');
module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: 'awesome-typescript-loader'
  });
  config.resolve.modules.push(path.resolve(__dirname, '../../tezos-ts-rpc/node_modules'));
  config.resolve.modules.push(
    path.resolve(__dirname, '../../tezos-ts-michelson-encoder/node_modules')
  );
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
