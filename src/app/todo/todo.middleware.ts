import { Todo } from '../../models/todo'
import { Request, Response, NextFunction } from 'express'

export const setTodo = async (req: Request, res: Response, next: NextFunction, id: number) => {
  try {
    const todo = await Todo.findByPk(id)

    if (!todo)
      return res.status(404).json({ error: 'Todo not found' })

    req.todo = todo
    return next()
  }
  catch (err) { next(err) }
}