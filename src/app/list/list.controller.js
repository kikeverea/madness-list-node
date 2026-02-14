const List = require('../../models/list')

const findAll = async (req, res, next) => {
  try {
    const lists = await List.findAll()
    res.json(lists)
  }
  catch (err) { next(err) }
}

const find = async (req, res, next) => {
  try {
    res.json(req.list)
  }
  catch (err) { next(err) }
}

const create = async (req, res, next) => {
  try {
    const list = await List.create(req.body)
    res.status(201).json(list)
  }
  catch (err) { next(err) }
}

const update = async (req, res, next) => {
  try {
    const list = await req.list.update(req.body)
    res.status(201).json(list)
  }
  catch (err) { next(err) }
}

const destroy = async (req, res, next) => {
  try {
    await req.list.delete(req.body)
    res.status(204)
  }
  catch (err) { next(err) }
}

module.exports = { findAll, find, create, update, destroy }