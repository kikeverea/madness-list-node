const PORT = 3000

const express = require('express')
const morgan = require('morgan')
const { unknownEndpoint } = require('./app/util/middleware');

const todosRouter = require('./app/routers/todos')
const listsRouter = require('./app/routers/lists')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

// Routes
app.use(todosRouter)
app.use(listsRouter)
app.use(unknownEndpoint)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))