const express = require('express')
const JsonDB = require('node-json-db')
const cors = require('cors')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const history = require('connect-history-api-fallback')
var ldap = require('./ldap')
var mail = require('./mail')
var config = require('./config')

var port = config.APP_PORT
var app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var db = new JsonDB('users', true, true)

// Gets all users
app.get('/users', function (req, res) {
  res.json(db.getData('/users'))
})

// Search a user
app.post('/userSearch', function (req, res) {
  try {
    db.getData(`/users/${req.body.uid}`)
    res.json(false)
  } catch (err) {
    res.json(true)
  }
})

// Gets all groups
app.get('/groups', function (req, reslt) {
  ldap.getGroup(req, reslt)
})

// Sends a new request to create IRCAN account
app.post('/users', function (req, res) {
  mail.sendMailAdmin(req, mail.connexion(), db, res)
})

// Deletes a request to create IRCAN account
app.post('/usersDelete', function (req, res) {
  mail.sendMailRefuse(req, mail.connexion(), db, res)
})

// Process a request to create IRCAN account
app.post('/usersAdd', function (req, reslt) {
  ldap.addUser(req, reslt, db)
})

app.use(history())
app.use(serveStatic(__dirname + '/dist/spa-mat'))
app.listen(port)
