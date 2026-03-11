import { Request } from 'express'

export const extractUserTag = (req: Request): string | undefined =>
  req.currentUser?.id ? String(req.currentUser.id) : req.ip