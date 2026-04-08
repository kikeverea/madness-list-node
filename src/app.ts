import express from 'express'
import unknownEndpoint from './middleware/unknownEndpoint'
import { errorHandler } from './middleware/errorHandler'
import router from './app/todo/todo.router'
import listsRouter from './app/list/list.router'
import usersRouter from './app/user/user.router'
import sessionRouter from './app/session/session.router'
import { buildCableRouter } from './cable/cable.router'
import userExtractor from './middleware/userExtractor'
import tokenExtractor from './middleware/tokenExtractor'
import requireSession from './middleware/requireSession'
import { logStreamer } from './cable/cable.middleware'
import expressWs from 'express-ws'


const app = express()
app.use(express.json())

app.use(tokenExtractor)
app.use(userExtractor)

app.use('/cable', buildCableRouter(expressWs(app)))
app.use('/api/sessions', sessionRouter)

app.use(requireSession)
app.use(logStreamer)

app.use('/api/todos', router)
app.use('/api/lists', listsRouter)
app.use('/api/users', usersRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app