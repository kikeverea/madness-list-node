import { RequestHandler } from 'express'

const requireSession: RequestHandler = async (req, res, next) => {
  console.log('MIDDLEWARE: requireSession')

  if (req.user)
    return next()
  else
    return res.status(401).json({ error: 'token missing' })
}

export default requireSession