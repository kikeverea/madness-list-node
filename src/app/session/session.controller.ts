import { RequestHandler } from 'express'
import { User } from '../../models'
import { cache } from '../../db/cache'
import tokenGenerator from './tokenGenerator'

const login: RequestHandler = async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ where: { username }})

  if (!user || !await user.validPassword(password))
    return res.status(401).json({ error: 'invalid username or password' })

  const token = tokenGenerator.generate()
  await cache.set(`sessions:${token}`, user.id, { EX: 60 * 60 * 24 * 7 })

  return res
    .status(200)
    .send({ token, username: user.username, name: user.name, lastname: user.lastname })
}

const logout: RequestHandler = async (req, res) => {
  const token = req.token

  if (token) {
    await cache.del(`sessions:${token}`)
    return res.status(200).end()
  }
  else return res.status(404).json({ error: 'could not log out' })
}

export default { login, logout }