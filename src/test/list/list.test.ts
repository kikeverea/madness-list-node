import app from '../../app'
import { createList, assertCountDiff, rand, expectJson, UserSession, login } from '../helpers'
import { List } from '../../models'
import request from 'supertest'

const api = request.agent(app)

let userSession: UserSession

beforeEach(async () => userSession = await login(api))
afterEach(async () => userSession.logout())

describe('lists', () => {
  test('fetches all lists', async () => {
    const lists = await Promise.all([...Array(5)].map((_, i: number) => createList({ name: `List ${i}` })))

    const res = await expectJson(api.get('/api/lists'), 200)

    const returned = res.body

    expect(returned.length).toBe(lists.length)
    returned
      .sort()
      .forEach((list: List, i: number) => expect(list.name).toBe(`List ${i}`))
  })

  test('fetches a list', async () => {
    const lists = await Promise.all([...Array(5)].map((_, i: number) => createList({ name: `List ${i}` })))
    const index = rand(lists.length)
    const list = lists[index]

    const res = await expectJson(api.get(`/api/lists/${list.id}`), 200)

    const fetchedList = res.body

    expect(fetchedList.name).toBe(`List ${index}`)
  })

  test('creates a list', async () => {
    await assertCountDiff(List, 1, async () => {
      const list = { name: 'Test list' }

      const res = await expectJson(api.post('/api/lists').send(list), 201)

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
      const res = await expectJson(api.put(`/api/lists/${list.id}`).send(list), 200)

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