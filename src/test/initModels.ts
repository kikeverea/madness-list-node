import { Sequelize } from 'sequelize'
import initTodo, { Todo } from '../models/todo'
import initList, { List } from '../models/list'

export const initModels = (sequelize: Sequelize) => {
  initList(sequelize)
  initTodo(sequelize)

  const models = { Todo, List }
  Object.values(models).forEach(model => model.associate?.(models as any))

  return models
}