import { Request } from 'express'
import pinoHTTP from 'pino-http'
import { cableLogStream } from './cable.router'
import { extractUserTag } from './extractUserTag'

export const logStreamer =
  pinoHTTP({
    stream: cableLogStream,
    customProps: (req: Request) => ({ userTag: extractUserTag(req) })
  })