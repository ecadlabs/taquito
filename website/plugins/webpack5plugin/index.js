// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');
module.exports = function () {
  return {
    name: 'webpack5-plugin',
    configureWebpack() {
      return {
        node: {
          __dirname: true
        },
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