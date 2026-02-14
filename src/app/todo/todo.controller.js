const Todo = require('../../models/todo')

const findAll = async (req, res, next) => {
  try {
    const todos = await Todo.findAll()
    res.json(todos)
  }
  catch (err) { next(err) }
}

const find = async (req, res, next) => {
  try {
    res.json(req.todo)
  }
  catch (err) { next(err) }
}

const create = async (req, res, next) => {
  try {
    const todo = await Todo.create(req.body)
    res.status(201).json(todo)
  }
  catch (err) { next(err) }
}

const update = async (req, res, next) => {
  try {
    const todo = await req.todo.update(req.body)
    res.status(201).json(todo)
  }
  catch (err) { next(err) }
}

const destroy = async (req, res, next) => {
  try {
    await req.todo.delete(req.body)
    res.status(204)
  }
  catch (err) { next(err) }
}

module.exports = { findAll, find, create, update, destroy }