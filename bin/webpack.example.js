const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './examples/index.js',
  output: {
    path: path.resolve(__dirname, '../demo'),
    filename: 'index.min.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/env']
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    }]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
