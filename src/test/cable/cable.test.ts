import '../../config/dotenv.config'
import app from '../../app'
import { login, UserSession } from '../helpers'
import request from 'supertest'

const api = request.agent(app)
const server = app.listen(4000)
let socket: WebSocket
let userSession: UserSession

beforeEach(async () => userSession = await login(api))
afterEach(async () => {
  socket?.close()
  await userSession.logout()
})
afterAll(() => server?.close())

const openSocket = (endpoint: string): WebSocket => {
  socket = new WebSocket(
    `ws://localhost:4000/cable/${endpoint}`,
    { headers: { Authorization: `Bearer ${userSession.token}` }}
  )

  return socket
}

type ServerMessage = { type: 'ready' | 'message', content?: string }
type ServerMessagePredicate = (message: ServerMessage) => boolean

const listenForMessages = (socket: WebSocket) => {
  let passCriteria: ((message: ServerMessage) => boolean) | null = null
  let promiseResolve: (value: ServerMessage) => void

  socket.addEventListener('open', () => {
    socket.addEventListener('message', event => {
      const message: ServerMessage = JSON.parse(event.data)
      passCriteria?.(message) && promiseResolve(message)
    })
  })

  return (messagePredicate: ServerMessagePredicate = () => true): Promise<ServerMessage> => {
    passCriteria = messagePredicate
    return new Promise((resolve) => promiseResolve = resolve)
  }
}

test('echoes', async () => {
  const messageCount = 50
  const socket = openSocket('echo')
  const data: string[] = []

  const awaitForMessage = listenForMessages(socket)
  await awaitForMessage(message => message.type === 'ready')

  for (let i = 0; i < messageCount; i++) {
    const payload = `Hello Server ${i}!`
    socket.send(payload)

    const message = await awaitForMessage(message => message.content === payload)
    data.push(message.content || '')
  }

  const expected = [...Array(messageCount)].map((_k, i) => `Hello Server ${i}!`)

  expect(data.sort()).toEqual(expected.sort())
})

test('plugs to logs', async () => {
  const socket = openSocket('echo')
  const awaitForMessage = listenForMessages(socket)
  await awaitForMessage(message => message.type === 'ready')

  await api.get('/api/lists').expect(200)

  const message = await awaitForMessage()

  console.log('MESSAGE', message)

  expect(message).toBeDefined()
  expect(message).toContain('200')
})