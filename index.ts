import './src/config/dotenv.config' // loads .env files

import app from './src/app'
import db from './src/db/database'
import cache from './src/db/cache'

const PORT = process.env.PORT

const connectDataSources = async () => {
  console.log('connecting to database')
  await db.connect()
  console.log('database connected')
  console.log('connecting to redis')
  await cache.connect()
  console.log('redis connected')
}

console.log('FROM INDEX: will connect data sources...')

connectDataSources()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.error('Could not connect datasources', error))

