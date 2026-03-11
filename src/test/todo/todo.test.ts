import app from '../../app'
import { assertCountDiff, createList, createTodo, expectJson, login, rand, UserSession } from '../helpers'
import { List, Todo } from '../../models'
import request from 'supertest'

const api = request.agent(app)

let userSession: UserSession
let list: List

beforeEach(async () => {
  userSession = await login(api)
  list = await createList()
})

afterEach(async () => userSession.logout())

describe('todos', () => {

  test('fetches all todos', async () => {
    const todos = await Promise.all([...Array(5)].map((_, i: number) => createTodo({ title: `Todo ${i}`}, list)))

    const res = await expectJson(api.get('/api/todos'), 200)

    const returned = res.body

    expect(returned.length).toBe(todos.length)
    returned
      .sort()
      .forEach((todo: Todo, i: number) => expect(todo.title).toBe(`Todo ${i}`))
  })

  test('fetches a todo', async () => {
    const todos = await Promise.all([...Array(5)].map((_, i: number) => createTodo({ title: `Todo ${i}`, listId: list.id })))
    const index = rand(todos.length)
    const todo = todos[index]

    const res = await expectJson(api.get(`/api/todos/${todo.id}`), 200)

    const fetchedTodo = res.body

    expect(fetchedTodo.title).toBe(`Todo ${index}`)
  })

  test('creates a todo', async () => {
    await assertCountDiff(Todo, 1, async () => {
      const todo = { title: 'Test todo', completed: true, listId: list.id }

      const res = await expectJson(api.post('/api/todos').send(todo), 201)

      const received = res.body
      const created = await Todo.findByPk(received.id, { raw: true }) || {}

      expect(received).toMatchObject(todo)
      expect(created).toMatchObject(todo)
    })
  })

  test('updates a todo', async () => {
    const created = await createTodo({ title: 'Test todo', completed: true, listId: list.id })
    const todo = { ...created.toJSON(), title: 'Updated todo', completed: false }

    await assertCountDiff(Todo, 0, async () => {

      const res = await expectJson(api.put(`/api/todos/${todo.id}`).send(todo), 200)

      const received = res.body
      const updated = await Todo.findByPk(todo.id, { raw: true }) || {}

      expect(todo).toEqual(received)
      expect(todo).toEqual(updated)
    })
  })

  test('deletes a todo', async () => {
    const todo = await createTodo({ title: 'Test todo', completed: true, listId: list.id })

    await assertCountDiff(Todo, -1, async () => {
      await api.delete(`/api/todos/${todo.id}`).expect(204)

      const deleted = await Todo.findByPk(todo.id)
      expect(deleted).toBeNull()
    })
  })
})