var express = require('express')
var app = express()
var path = require('path')

var session = require('express-session')
app.use(session({
    secret: 'keepitsafe',
    resave: false,
    saveUninitialized: true
}))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, './bower_components')))
app.use(express.static(path.join(__dirname, './client')))

require('./server/config/mongoose_setup')
require('./server/config/routes')(app)

app.listen(8000, function() {
    console.log("listening on port 8000")
})
