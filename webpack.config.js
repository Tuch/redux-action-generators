const webpack = require('webpack');
const path = require('path');

const { NODE_ENV } = process.env;

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
];

const mode = NODE_ENV || 'development';
const filename = `redux-action-generators${
  mode === 'production' ? '.min' : ''
}.js`;

module.exports = {
  mode,
  module: {
    rules: [{ test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ }],
  },

  entry: ['./src/index'],

  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'ReduxActionGenerators',
    libraryTarget: 'umd',
  },

  plugins,
};
