import { sequelize } from '../db/sequelize';

import initTodo, { Todo } from '../models/todo'
import initList, { List } from '../models/list'

initList(sequelize)
initTodo(sequelize)

const models = { Todo, List }
Object.values(models).forEach((m) => m.associate?.(models as any))

export { sequelize, Todo, List }
