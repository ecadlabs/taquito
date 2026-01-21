/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  entry: {
    "taquito_michel_codec": ['./src/taquito-michel-codec.ts']
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'esbuild-loader',
          options: {
            target: 'es2020',
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
      'node_modules'
    ],
    alias: {
      '@taquito/core': path.resolve(__dirname, '../taquito-core/src/taquito-core.ts')
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: ['[name]'],
    libraryTarget: "var"
  }
};
