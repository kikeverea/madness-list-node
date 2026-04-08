import { Request } from 'express'
import pinoHTTP from 'pino-http'
import { cableUtil } from './cable.util'
import cableLogHub from './cableLogHub'

const cableLogStream = {
  write: (log: string) => cableLogHub.stream(log)
}

export const logStreamer =
  pinoHTTP({
    stream: cableLogStream,
    customProps: (req: Request) => ({ userTag: cableUtil(req) })
  })