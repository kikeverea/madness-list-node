import { Application, Router } from 'express'
import expressWs from 'express-ws'
import { createWebSocketStream } from 'ws'
import { httpPrintFactory } from 'pino-http-print'
import { Transform } from 'node:stream'
import { Request } from 'express'

const subscribers: Map<String, Transform> = new Map()

export const cableLogStream = {
  write: (log: string) => {

    const logObject = JSON.parse(log)
    const userTag = logObject.customProps.userTag

    if (userTag) {
      const subscriber = subscribers.get(userTag)
      const normalizedLog = log.endsWith('\n') ? log : log + '\n'

      subscriber?.write(normalizedLog)
    }
  }
}

export const extractUserTag = (req: Request): string | undefined => {
  return req.user?.id || req.ip
}

export const buildCableRouter = (app: Application) => {
  const router = Router()

  expressWs(app).applyTo(router)

  router.ws('/echo', (ws, _req) => {
    ws.on('message', msg => ws.send(msg))
  })

  router.ws('/http_logs', (ws, req) => {

    const buildPrinter = httpPrintFactory()
    const printer = buildPrinter(createWebSocketStream(ws))

    const userTag = extractUserTag(req)

    if (userTag)
      subscribers.set(userTag, printer)
  })

  return router
}