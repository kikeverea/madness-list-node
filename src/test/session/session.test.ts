import '../../config/dotenv.config'
import supertest from 'supertest'
import app from '../../app'
import { User } from '../../models'
import { cache } from '../../db/cache'
import tokenGenerator from '../../app/session/tokenGenerator'

const api = supertest(app)
let user: User

beforeEach(async () => {
  user = await User.create({ username: 'test_user' })
  await user.setPassword('12341234')
})

describe('session', () => {

  test('logs in', async () => {
    jest.spyOn(tokenGenerator, 'generate').mockReturnValue('test-token')

    const res = await api
      .post('/api/sessions/login')
      .send({ username: 'test_user', password: '12341234' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const session = await cache.get('sessions:test-token')

    expect(res.body.token).toBe('test-token')
    expect(session).toEqual(String(user.id))
  })

  test('returns logged in user', async () => {
    const auth = await api.post('/api/sessions/login').send({ username: 'test_user', password: '12341234' })
    const token = auth.body.token

    const res = await api
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const user = res.body

    expect(user.username).toBe('test_user')
  })

  test('logs out', async () => {
    jest.spyOn(tokenGenerator, 'generate').mockReturnValue('test-token')

    const auth = await api.post('/api/sessions/login').send({ username: 'test_user', password: '12341234' })
    const token = auth.body.token

    await api
      .get('/api/sessions/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const session = await cache.get('sessions:test-token')
    expect(session).toBeNull()
  })
})