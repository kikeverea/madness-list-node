import { database } from '../db/database'

import initTodo, { Todo } from '../models/todo'
import initList, { List } from '../models/list'
import initUser, { User } from '../models/user'

initList(database)
initTodo(database)
initUser(database)

const models = { Todo, List, User }
Object.values(models).forEach(model => model.associate?.(models as any))

export { database, Todo, List, User }