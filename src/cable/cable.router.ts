import { Router } from 'express'
import expressWs from 'express-ws'
import { createWebSocketStream } from 'ws'
import { httpPrintFactory } from 'pino-http-print'
import { cableUtil } from './cable.util'
import cableLogHub from './cableLogHub'

export const buildCableRouter = (websocket: expressWs.Instance) => {
  const router = Router()

  websocket.applyTo(router)

  router.ws('/echo', (ws, _req) => {
    ws.on('message', msg => ws.send(JSON.stringify({ type: 'message', content: msg })))
    ws.send(JSON.stringify({ type: 'ready' }))
  })

  router.ws('/http_logs', (ws, req) => {
    const buildPrinter = httpPrintFactory()
    const printer = buildPrinter(createWebSocketStream(ws))

    const userTag = cableUtil(req)

    if (userTag) {
      cableLogHub.subscribe(userTag, printer)
      ws.on('close', () => cableLogHub.unsubscribe(userTag))

      ws.send(JSON.stringify({ type: 'ready' }))
    }
  })

  return router
}