const express = require('express')
const bodyParser = require('body-parser')
const bunyan = require('bunyan')

const getRoot = require('./routes/get-root')
const postRoot = require('./routes/post-root')

const app = express()
const router = express.Router()
const BASE_PATH = '/enterprise-testing-patterns'

// Scaffold out some boilerplate stuff to create a global logger and allow POST bodys
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(bodyParser.json())
app.use((req, res, next) => {
  req.logger = bunyan.createLogger({ name: 'enterprise-testing-patterns', path: req.path })
  next()
})

// Define our routes here!
router.get('/', getRoot)
router.post('/', postRoot)
// attach our routes to the app basePath
app.use(BASE_PATH, router)

module.exports = app
