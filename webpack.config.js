'use strict';

const path = require('path');

module.exports = {
  devtool: '#source-map',
  entry: [
    './src/index.js',
  ],
  node: {
    fs: 'empty',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'cssish',
    libraryTarget: 'var',
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      loader: 'babel',
      exclude: /node_modules/,
    }],
  },
};
