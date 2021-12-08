// eslint-disable-next-line
module.exports = function (context, options) {
  return {
    name: 'webpack5-plugin',
    // eslint-disable-next-line
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          fallback: {
            fs: false,
            http: false,
            https: false,
            os: false,
            path: false,
            stream: false,
            crypto: false,
            buffer: false
          },
        },
      };
    },
  };
};