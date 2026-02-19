import { List, Todo } from '../models'
import { Model, ModelStatic } from 'sequelize'

let todoCounter = 0

export const createList = async (list?: Partial<List>) => {
  const attrs = list || {}

  return List.create({ name: attrs.name || 'Test list' })
}

export const createTodo = async (todo?: Partial<Todo> & { index?: number }, list?: List) => {

  const attrs = todo || {}
  const todoList = list ?? await createList()

  return Todo.create({
    title: attrs.title || `Test todo ${attrs.index || ++todoCounter}`,
    listId: todoList.id
  })
}

export const assertCountDiff = async <M extends Model>(model: ModelStatic<M>, diff: number, fn: () => Promise<unknown> | unknown) => {
  const elementsBefore = await model.count()
  await fn()
  const elementsAfter = await model.count()

  expect(elementsAfter - elementsBefore).toBe(diff)
}