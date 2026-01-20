/* eslint-disable @typescript-eslint/no-var-requires */
const TerserPlugin = require('terser-webpack-plugin');
const pkg = require('./package.json');
const path = require('path');
var { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
var WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = {
  mode: 'production',
  entry: "./dist/lib/taquito.js",
  output: {
    library: 'taquito',
    libraryTarget: 'umd',
    path: __dirname,
    filename: pkg.unpkg,
    crossOriginLoading: 'anonymous'
  },
  resolve: {
    fallback: {
      fs: false,
      stream: require.resolve("stream-browserify")
    },
    conditionNames: ['import', 'module', 'browser', 'default'],
    alias: {
      '@noble/hashes': path.resolve(__dirname, '../../node_modules/@noble/hashes/esm')
    }
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new SubresourceIntegrityPlugin({
      hashFuncNames: ['sha384'],
      enabled: true
    }),
    new WebpackAssetsManifest({ integrity: true })
  ]
}
