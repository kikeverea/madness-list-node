declare module 'pino-http-print' {
  import type { Transform } from 'node:stream';

  export interface HttpPrintOptions {
    colorize?: boolean
    all?: boolean
    translateTime?: boolean | string
    relativeUrl?: boolean
    lax?: boolean
  }

  export function httpPrintFactory(
    options?: HttpPrintOptions,
    pinoPrettyOptions?: Record<string, unknown>
  ): (dest?: NodeJS.WritableStream) => Transform
}
