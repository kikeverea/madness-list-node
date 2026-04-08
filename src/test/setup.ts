import { getDatabaseForWorker } from './database'
import { Sequelize } from 'sequelize'
import initTodo from '../models/todo'
import initList from '../models/list'
import initUser from '../models/user'
import { List, Todo } from '../models'

export async function truncateAll() {
  const database = await getDatabaseForWorker()
  const models = Object.values(database.models)

  for (const model of Object.values(models))
    await model.truncate({ cascade: true, restartIdentity: true })
}

export const initModels = (sequelize: Sequelize) => {
  initList(sequelize)
  initTodo(sequelize)
  initUser(sequelize)

  const models = { Todo, List }
  Object.values(models).forEach(model => model.associate?.(models as any))

  return models
}