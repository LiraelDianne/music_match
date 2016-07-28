var express = require('express')
var app = express()
var path = require('path')

app.use(express.static(path.join(__dirname, '')))

app.use(express.static(path.join(__dirname, './bower_components')))
app.use(express.static(path.join(__dirname, './client')))

app.listen(8000, function() {
    console.log("listening on port 8000")
})
