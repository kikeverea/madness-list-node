import { RequestHandler } from 'express'
import { cache } from '../db/cache'
import { User } from '../models'

const userExtractor: RequestHandler = async (req, _res, next) => {
  const token = req.token

  if (token) {
    const userId = await cache.get(`sessions:${token}`)

    if (!userId)
      return next()

    const user = await User.findByPk(userId)

    if (user)
      req.currentUser = user
  }

  console.log('WILL CALL NEXT')
  next()
}

export default userExtractor