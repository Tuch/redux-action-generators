import webpack from 'webpack';
import path from 'path';

const { NODE_ENV } = process.env;

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
];

const mode =  NODE_ENV || 'development'
const filename = `redux-actions-generator${mode === 'production' ? '.min' : ''}.js`;

export default {
  mode,
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ },
    ],
  },

  entry: [
    './src/index',
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'ReduxActionsGenerator',
    libraryTarget: 'umd',
  },

  plugins,
};
