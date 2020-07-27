const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
  entry: {
    index: './src/index.js',
    polyfill: './src/polyfill-ie.js'
  },
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    'lodash.clonedeep': 'lodash.clonedeep',
    '@popperjs/core': '@popperjs/core',
    'prosemirror-model': 'prosemirror-model',
    'prosemirror-schema-basic': 'prosemirror-schema-basic',
    'prosemirror-schema-list': 'prosemirror-schema-list',
    'prosemirror-state': 'prosemirror-state',
    'prosemirror-view': 'prosemirror-view',
    'prosemirror-history': 'prosemirror-history',
    'prosemirror-keymap': 'prosemirror-keymap',
    'prosemirror-commands': 'prosemirror-commands',
    'prosemirror-menu': 'prosemirror-menu',
    'prosemirror-tables': 'prosemirror-tables',
    'prosemirror-dropcursor': 'prosemirror-dropcursor',
    'prosemirror-gapcursor': 'prosemirror-gapcursor',
    'prosemirror-menu/style/menu.css': 'prosemirror-menu/style/menu.css'
  },
  plugins: [
    new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)()
  ]
})
