import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

const SECRET = process.env.SECRET

const tokenExtractor: RequestHandler = (req, res, next) => {
  const authorization = req.get('authorization')

  if (!SECRET)
    return res.status(500).json({ error: 'Could not validate user' })

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    }
    catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  }
  else {``
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

export default tokenExtractor