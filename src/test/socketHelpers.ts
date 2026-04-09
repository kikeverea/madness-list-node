import { UserSession } from './helpers'

type ServerMessage = { type: 'ready' | 'message', content?: string }
type ServerMessagePredicate = (message: ServerMessage) => boolean

export const openSocket = (endpoint: string, userSession: UserSession): WebSocket => {
  return new WebSocket(
    `ws://localhost:${process.env.PORT}/cable/${endpoint}`,
    { headers: { Authorization: `Bearer ${userSession.token}` }}
  )
}

export const listenForMessages = (socket: WebSocket) => {
  let passCriteria: ((message: ServerMessage) => boolean) | null = null
  let promiseResolve: (value: ServerMessage) => void

  socket.addEventListener('message', async event => {
    const message = typeof event.data === 'string' ?
      JSON.parse(event.data) :
      await event.data.text()

    passCriteria?.(message) && promiseResolve(message)
  })

  return (messagePredicate: ServerMessagePredicate = () => true): Promise<ServerMessage> => {
    passCriteria = messagePredicate
    return new Promise((resolve) => promiseResolve = resolve)
  }
}