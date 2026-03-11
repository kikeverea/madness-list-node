import { createClient } from 'redis'

export const cache = createClient()

const connect = async () => {
  cache.on('error', err => console.error('Redis Client Error', err))
  await cache.connect()
}

const disconnect = async () => {
  cache.isOpen && await cache.quit()
}

export default { connect, disconnect }