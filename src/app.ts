import express from 'express'
import morgan from 'morgan'
import pinoHTTP from 'pino-http'
import unknownEndpoint from './middleware/unknownEndpoint'
import { errorHandler } from './middleware/errorHandler'
import router from './app/todo/todo.router'
import listsRouter from './app/list/list.router'
import { buildCableRouter, cableLogStream, extractUserTag } from './cable/cable.router'

const app = express()

app.use(express.json())
app.use(pinoHTTP({
  stream: cableLogStream,
  customProps: req => ({ userTag: extractUserTag(req) })
}))

// Routes
app.use('/api/todos', router)
app.use('/api/lists', listsRouter)
app.use('/cable', buildCableRouter(app))
app.use(unknownEndpoint)
app.use(errorHandler)

export default app