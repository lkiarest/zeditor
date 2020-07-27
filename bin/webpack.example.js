const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
  entry: './examples/index.js',
  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: 'index.min.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
})
