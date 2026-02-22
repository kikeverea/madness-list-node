import '../../config/dotenv.config'
import app from '../../app'

let server: ReturnType<typeof app.listen>

beforeAll(() => {
  server = app.listen(3000, () => {})
})

afterAll(() => server?.close())

test('echoes', async () => {
  const socket = new WebSocket('ws://localhost:3000/cable/echo')
  const data: string[] = []
  const messages = 50

  let communicationOver: (value: unknown) => void
  const waitForCommunication = new Promise((resolve) => communicationOver = resolve)

  socket.addEventListener('open', () => {
    socket.addEventListener('error', error => console.error('WebSocket error:', error))

    for (let i = 0; i < messages; i++)
      socket.send(`Hello Server ${i}!`)
  })


  socket.addEventListener('message', event => {
    data.push(event.data)

    if (data.length === messages)
      communicationOver(true)
  })

  await waitForCommunication

  const expected = [...Array(messages)].map((_k, i) => `Hello Server ${i}!`)
  expect(data.sort()).toEqual(expected.sort())

  socket.close()
})