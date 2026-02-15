import { RequestHandler } from 'express'

import { List } from '../../models/list'

const findAll: RequestHandler = async (_req, res, next) => {
  try {
    const lists = await List.findAll()
    res.json(lists)
  }
  catch (err) { next(err) }
}

const find: RequestHandler = async (req, res, next) => {
  try {
    res.json(req.list)
  }
  catch (err) { next(err) }
}

const create: RequestHandler = async (req, res, next) => {
  try {
    const list = await List.create(req.body)
    res.status(201).json(list)
  }
  catch (err) { next(err) }
}

const update: RequestHandler = async (req, res, next) => {
  try {
    const list = await req.list!.update(req.body)
    res.status(201).json(list)
  }
  catch (err) { next(err) }
}

const destroy: RequestHandler = async (req, res, next) => {
  try {
    await req.list!.destroy()
    res.status(204)
  }
  catch (err) { next(err) }
}

export default { findAll, find, create, update, destroy }