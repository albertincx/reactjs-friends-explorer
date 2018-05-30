import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'

const dbConf = require('./config/config')

if (!dbConf.httpPort) throw 'Config not found'

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Methods', 'POST,DELETE,GET')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
require('./routes')(app)
const httpServer = http.createServer(app)
httpServer.listen(parseInt(dbConf.httpPort))