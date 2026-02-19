import express from 'express'
import morgan from 'morgan'
import router from './app/todo/todo.router'
import listsRouter from './app/list/list.router'
import unknownEndpoint from './middleware/unknownEndpoint'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

// Routes
app.use('/api/todos', router)
app.use('/api/lists', listsRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

export default app