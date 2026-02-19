import '../../config/dotenv.config'
import supertest from 'supertest'
import app from '../../app'
import db from '../../db/database'
import { truncateAll } from '../setup'
import { assertCountDiff, createList, createTodo } from '../helpers'
import { List, Todo } from '../../models'

const api = supertest(app)

let list: List

beforeAll(async () => db.connect())

beforeEach(async () => {
  await truncateAll()
  list = await createList()
})

describe('todos', () => {

  test('todos are returned', async () => {
    const todos = await Promise.all([...Array(5)].map((_, i: number) => createTodo({ title: `Todo ${i}`}, list)))

    const res = await api
      .get('/api/todos')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const returned = res.body

    expect(returned.length).toBe(todos.length)
    returned
      .sort()
      .forEach((todo: Todo, i: number) => expect(todo.title).toBe(`Todo ${i}`))
  })

  test('creates a todo', async () => {
    await assertCountDiff(Todo, 1, async () => {
      const todo = { title: 'Test todo', completed: true, listId: list.id }

      const res = await api
        .post('/api/todos')
        .send(todo)
        .expect(201)
        .expect('Content-Type', /application\/json/)

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

      const res = await api
        .put(`/api/todos/${todo.id}`)
        .send(todo)
        .expect(200)
        .expect('Content-Type', /application\/json/)

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