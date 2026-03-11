import '../config/dotenv.config'
import { getDatabaseForWorker } from './database'
import cache from '../db/cache'
import { initModels, truncateAll } from './setup'

beforeAll(async () => {
  await connectDatabase()
  await connectCache()
})

beforeEach(async () => {
  await truncateAll()
})

afterAll(async () => {
  await disconnectDatabase()
  await disconnectCache()
})


const connectDatabase = async () => {
  const sequelize = await getDatabaseForWorker()

  initModels(sequelize)

  await sequelize.authenticate()
  await sequelize.sync({ force: true })
}

const disconnectDatabase = async () => {
  const sequelize = await getDatabaseForWorker()
  await sequelize.close()
}

const connectCache = async () => cache.connect()
const disconnectCache = async () => cache.disconnect()