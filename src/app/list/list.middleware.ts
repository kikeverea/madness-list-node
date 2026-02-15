import { Request, Response, NextFunction } from 'express'
import { List } from '../../models/list'

export const setList = async (req: Request, res: Response, next: NextFunction, id: string | number) => {
  try {
    const list = await List.findByPk(id)

    if (!list)
      return res.status(404).json({ error: 'List not found' })

    req.list = list
    next()
  }
  catch (err) { next(err) }
}