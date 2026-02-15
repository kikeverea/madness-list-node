import { Request, Response, NextFunction } from 'express'

export default (req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${req.method}]`, req.path)
  if (req.body)
    console.log('Body:', req.body)

  return next()
}