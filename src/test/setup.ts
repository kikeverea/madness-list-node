import { getDatabaseForWorker } from './database'

export async function truncateAll() {
  const database = await getDatabaseForWorker()
  const models = Object.values(database.models)

  for (const model of Object.values(models))
    await model.truncate({ cascade: true, restartIdentity: true })
}
