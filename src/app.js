const express = require('express')
const morgan = require('morgan')
const router = require('./app/todo/todo.router')
const listsRouter = require('./app/list/list.router')
const { unknownEndpoint } = require('./middleware')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

// Routes
app.use('/api/todos', router)
app.use('/api/lists', listsRouter)
app.use(unknownEndpoint)

module.exports = app