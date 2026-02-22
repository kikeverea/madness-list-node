import express from 'express'
import morgan from 'morgan'
import unknownEndpoint from './middleware/unknownEndpoint'
import { errorHandler } from './middleware/errorHandler'
import router from './app/todo/todo.router'
import listsRouter from './app/list/list.router'
import { buildCableRouter } from './cable/cable.router'

const app = express()
const cableRouter = buildCableRouter(app)

app.use(express.json())
app.use(morgan('tiny'))

// Routes
app.use('/api/todos', router)
app.use('/api/lists', listsRouter)
app.use('/cable', cableRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

export default app