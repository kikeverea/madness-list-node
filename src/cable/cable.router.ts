import { Application, Router } from 'express'
import expressWs from 'express-ws'


export const buildCableRouter = (app: Application) => {
  const router = Router()

  expressWs(app).applyTo(router)

  router.ws('/echo', (ws, _req) => {
    ws.on('message', msg => ws.send(msg))
  })

  return router
}