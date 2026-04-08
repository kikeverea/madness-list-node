import { NextFunction, Request, Response } from 'express'
import { User } from '../../models'

export const setUser = async (req: Request, res: Response, next: NextFunction, id: number) => {
  try {
    const user = await User.findByPk(id)

    if (!user)
      return res.status(404).json({ error: 'User not found' })

    req.user = user
    return next()
  }
  catch (err) { next(err) }
}