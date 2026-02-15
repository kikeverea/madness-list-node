import type { Todo } from '../models/todo'
import type { List } from '../models/list'
import { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      list?: List
      todo?: Todo
      decodedToken?: string | JwtPayload
    }
  }
}

export {}
