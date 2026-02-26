import '../../config/dotenv.config'
import app from '../../app'
import supertest from 'supertest'
import db from '../../db/database'

const server = app.listen(4000)
const api = supertest(app)
let socket: WebSocket

beforeAll(async () => await db.connect())
afterEach(() => socket?.close())
afterAll(() => server?.close())

const openSocket = (endpoint: string): WebSocket => {
  socket = new WebSocket(`ws://localhost:4000/cable/${endpoint}`)
  return socket
}

type SocketEvent = Event | MessageEvent | ErrorEvent
function awaitFor(socket: WebSocket, eventName: 'message'): Promise<MessageEvent>;
function awaitFor(socket: WebSocket, eventName: 'open'): Promise<Event>;
function awaitFor(socket: WebSocket, eventName: 'open'|'message'|'error'): Promise<SocketEvent> {
  let resolveEvent: (value: SocketEvent) => void

  socket.addEventListener(eventName, event => resolveEvent(event))

  if (eventName === 'open')
    socket.addEventListener('error', error => console.error('WebSocket error:', error))

  return new Promise((resolve) => resolveEvent = resolve)
}

test('echoes', async () => {
  const socket = openSocket('echo')
  const data: string[] = []
  const messageCount = 50

  await awaitFor(socket, 'open')

  for (let i = 0; i < messageCount; i++) {
    socket.send(`Hello Server ${i}!`)

    const event = await awaitFor(socket, 'message')
    data.push(event.data)
  }

  const expected = [...Array(messageCount)].map((_k, i) => `Hello Server ${i}!`)
  expect(data.sort()).toEqual(expected.sort())
})

test('plugs to logs', async () => {
  const socket = openSocket('http_logs')

  await awaitFor(socket, 'open')
  await api.get('/api/lists').expect(200)

  const event = await awaitFor(socket, 'message')
  const message = await event.data.text()

  expect(message).toBeDefined()
  expect(message).toContain('200')
})