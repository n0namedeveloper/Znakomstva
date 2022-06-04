
const express = require('express')

const app = express()

app.use('/static', express.static(__dirname + '../Znakomstva'))

app.use('/', function (request, response) {
  response.sendFile(__dirname + './index.html')
})

app.listen(3000)