import { getDatabaseForWorker } from './database'
import { initModels } from './initModels'

beforeAll(async () => {
  const sequelize = await getDatabaseForWorker()

  initModels(sequelize)

  await sequelize.authenticate()
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  const sequelize = await getDatabaseForWorker()
  await sequelize.close()
})
