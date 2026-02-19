import '../../config/dotenv.config'
import supertest from 'supertest'
import app from '../../app'
import db from '../../db/database'
import { truncateAll } from '../setup'
import { createList, assertCountDiff } from '../helpers'
import { List } from '../../models'

const api = supertest(app)

beforeAll(async () => db.connect())

beforeEach(async () => {
  await truncateAll()
})

describe('lists', () => {
  test('lists are returned', async () => {
    const lists = await Promise.all([...Array(5)].map((_, i: number) => createList({ name: `List ${i}` })))

    const res = await api
      .get('/api/lists')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const returned = res.body

    expect(returned.length).toBe(lists.length)
    returned
      .sort()
      .forEach((list: List, i: number) => expect(list.name).toBe(`List ${i}`))
  })

  test('creates a list', async () => {
    await assertCountDiff(List, 1, async () => {
      const list = { name: 'Test list' }

      const res = await api
        .post('/api/lists')
        .send(list)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const received = res.body
      const created = await List.findByPk(received.id, { raw: true }) || {}

      expect(received).toMatchObject(list)
      expect(created).toMatchObject(list)
    })
  })

  test('updates a list', async () => {
    const created = await createList({ name: 'Test list' })
    const list = { ...created.toJSON(), name: 'Updated list' }

    await assertCountDiff(List, 0, async () => {
      const res = await api
        .put(`/api/lists/${list.id}`)
        .send(list)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const received = res.body
      const updated = await List.findByPk(list.id, { raw: true }) || {}

      expect(list).toEqual(received)
      expect(list).toEqual(updated)
    })
  })

  test('deletes a list', async () => {
    const list = await createList({ name: 'Test list' })

    await assertCountDiff(List, -1, async () => {
      await api.delete(`/api/lists/${list.id}`).expect(204)

      const deleted = await List.findByPk(list.id)
      expect(deleted).toBeNull()
    })
  })
})