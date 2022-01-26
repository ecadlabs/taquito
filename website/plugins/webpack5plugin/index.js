const webpack = require('webpack');
module.exports = function (context, options) {
  return {
    name: 'webpack5-plugin',
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          fallback: {
            fs: false,
            http: false,
            https: false,
            os: false,
            path: false,
            stream: require.resolve('stream-browserify'),
            crypto: false,
            buffer: require.resolve('buffer/'),
          },
        },
        plugins: [
          new webpack.ProvidePlugin({
              Buffer: ['buffer', 'Buffer'],
          }),
      ],
      };
    },
  };
};