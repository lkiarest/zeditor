const config = require('./webpack.example')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const compiler = webpack(config)

const server = new WebpackDevServer(compiler)

server.listen(8080)
