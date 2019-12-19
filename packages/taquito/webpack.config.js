const TerserPlugin = require('terser-webpack-plugin');
const pkg = require('./package.json');

module.exports = {
  mode: 'production',
  entry: "./dist/lib/taquito.js",
  output: {
    library: 'taquito',
    libraryTarget: 'umd',
    path: __dirname,
    filename: pkg.unpkg
  },
  node: {
    fs: 'empty'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
}
