import { Router } from 'express'
import expressWs from 'express-ws'
import { createWebSocketStream } from 'ws'
import { httpPrintFactory } from 'pino-http-print'
import { Transform } from 'node:stream'
import { extractUserTag } from './extractUserTag'

const subscribers: Map<String, Transform> = new Map()

export const cableLogStream = {
  write: (log: string) => {
    console.log('STREAM GOT MESSAGE', log)

    const logObject = JSON.parse(log)
    const userTag = logObject.userTag

    console.log('user tag', userTag)

    if (userTag) {
      const subscriber = subscribers.get(userTag)
      const normalizedLog = log.endsWith('\n') ? log : log + '\n'

      subscriber?.write(normalizedLog)
    }
  }
}

export const buildCableRouter = (websocket: expressWs.Instance) => {
  const router = Router()

  websocket.applyTo(router)

  router.ws('/echo', (ws, _req) => {
    ws.on('message', msg => ws.send(JSON.stringify({ type: 'message', content: msg })))
    ws.send(JSON.stringify({ type: 'ready' }))
  })

  router.ws('/http_logs', (ws, req) => {
    console.log('got http_logs')

    const buildPrinter = httpPrintFactory()
    const printer = buildPrinter(createWebSocketStream(ws))

    const userTag = extractUserTag(req)
    console.log('USER TAG', userTag)

    if (userTag)
      subscribers.set(userTag, printer)
  })

  return router
}