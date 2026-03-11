import { RequestHandler } from 'express'
import { User } from '../../models'

const findAll: RequestHandler = async (_req, res, next) => {
  try {
    const users = await User.findAll()
    return res.json(users)
  }
  catch (err) {
    console.log(err); next(err) }
}

const find: RequestHandler = async (req, res, next) => {
  try {
    return res.json(req.user)
  }
  catch (err) { next(err) }
}

const me: RequestHandler = async (req, res, next) => {
  try {
    return res.json(req.currentUser)
  }
  catch (err) { next(err) }
}

const create: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    return res.status(201).json(user)
  }
  catch (err) { next(err) }
}

const update: RequestHandler = async (req, res, next) => {
  try {
    const user = await req.user!.update(req.body)
    return res.status(200).json(user)
  }
  catch (err) { next(err) }
}

const destroy: RequestHandler = async (req, res, next) => {
  try {
    await req.user!.destroy()
    return res.status(204).end()
  }
  catch (err) { next(err) }
}

export default { findAll, find, me, create, update, destroy }