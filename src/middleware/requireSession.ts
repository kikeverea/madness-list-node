import { RequestHandler } from 'express'

const requireSession: RequestHandler = async (req, res, next) => {
  if (req.currentUser)
    return next()
  else
    return res.status(401).json({ error: 'token missing' })
}

export default requireSession