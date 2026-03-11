import type { Todo } from '../models'
import type { List } from '../models'
import { User } from '../models'

declare global {
  namespace Express {
    interface Request {
      list?: List
      todo?: Todo
      user?: User
      currentUser?: User
      token?: string
    }
  }
}

export {}
