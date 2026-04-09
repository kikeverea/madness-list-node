import '../../config/dotenv.config'
import app from '../../app'
import { login, UserSession } from '../helpers'
import request from 'supertest'
import { listenForMessages, openSocket } from '../socketHelpers'

const api = request.agent(app)
const server = app.listen(process.env.PORT)
let socket: WebSocket
let userSession: UserSession

beforeEach(async () => {
  userSession = await login(api)
})
afterEach(async () => {
  socket?.close()
  await userSession.logout()
})
afterAll(() => server?.close())


describe('cable', () => {
  test('echoes', async () => {
    socket = openSocket('echo', userSession)

    const messageCount = 50
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
    socket = openSocket('http_logs', userSession)

    const awaitForMessage = listenForMessages(socket)
    await awaitForMessage(message => message.type === 'ready')

    api.get('/api/lists').end()

    const message = await awaitForMessage()

    expect(message).toBeDefined()
    expect(message).toContain('200')
  })
})