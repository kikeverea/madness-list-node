import { List, Todo, User } from '../models'
import { Model, ModelStatic } from 'sequelize'
import tokenGenerator from '../app/session/tokenGenerator'
import { cache } from '../db/cache'
import request from 'supertest'
import TestAgent from 'supertest/lib/agent'

let todoCounter = 0

export type UserSession = {
  token: string
  logout: () => Promise<void>,
}

export const login = async (api: TestAgent): Promise<UserSession> => {
  let token: string = ''

  const user = await User.create({ username: 'Test user' })
  token = tokenGenerator.generate()

  api.set('Authorization', `Bearer ${token}`)
  await cache.set(`sessions:${token}`, user.id, { EX: 60 * 60 * 24 * 7 })

  return {
    logout: async () => {
      await cache.del(`sessions:${token}`)
    },
    token: token
  }
}

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

export const expectJson = (req: request.Test, responseCode: number) =>
  req.expect(responseCode).expect('Content-Type', /application\/json/)

export const rand = (...nums: number[]) => {
  if (nums.length !== 1 && nums.length !== 2)
    throw new Error(`'rand' function takes one or two arguments. Args passed: ${nums}`)

  const from = nums[0]
  const to = nums.length == 2 ? nums[1] : 0

  return Math.floor(Math.random() * (from + to))
}