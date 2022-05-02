import TerserPlugin from 'terser-webpack-plugin';
import pkg from './package.json';
import SriPlugin from 'webpack-subresource-integrity';
import WebpackAssetsManifest from 'webpack-assets-manifest';

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
  node: {
    fs: 'empty'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new SriPlugin({
      hashFuncNames: ['sha384'],
      enabled: true
    }),
    new WebpackAssetsManifest({ integrity: true })
  ]
}
