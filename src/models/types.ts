import type { Todo } from './todo'
import type { List } from './list'

export type AppModels = {
  Todo: typeof Todo
  List: typeof List
}
