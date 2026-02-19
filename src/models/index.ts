import { database } from '../db/database'

import initTodo, { Todo } from '../models/todo'
import initList, { List } from '../models/list'

initList(database)
initTodo(database)

const models = { Todo, List }
Object.values(models).forEach(model => model.associate?.(models as any))

export { database, Todo, List }