import { RequestHandler } from 'express'
import { Todo } from '../../models'

const findAll: RequestHandler = async (_req, res, next) => {
  try {
    const todos = await Todo.findAll()
    res.json(todos)
  }
  catch (err) {
    console.log(err); next(err) }
}

const find: RequestHandler = async (req, res, next) => {
  try {
    res.json(req.todo)
  }
  catch (err) { next(err) }
}

const create: RequestHandler = async (req, res, next) => {
  try {
    const todo = await Todo.create(req.body)
    res.status(201).json(todo)
  }
  catch (err) { next(err) }
}

const update: RequestHandler = async (req, res, next) => {
  try {
    const todo = await req.todo!.update(req.body)
    res.status(200).json(todo)
  }
  catch (err) { next(err) }
}

const destroy: RequestHandler = async (req, res, next) => {
  try {
    await req.todo!.destroy(req.body)
    res.status(204)
  }
  catch (err) { next(err) }
}

export default { findAll, find, create, update, destroy }