import type { Transform } from 'node:stream'

const subscribers = new Map<string, Transform>()

export default {
  subscribe(userTag: string, subscriber: Transform) {
    subscribers.set(userTag, subscriber)
  },

  unsubscribe(userTag: string) {
    subscribers.delete(userTag)
  },

  stream(log: string) {
    const logObject = JSON.parse(log)
    const userTag = logObject.userTag

    if (userTag) {
      subscribers.get(userTag)?.write(log)
    }
  },
}