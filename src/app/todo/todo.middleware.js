const { Todo } = require('../../models')

const setTodo = async (req, res, next, id) => {
  try {
    const todo = await Todo.findByPk(id)

    if (!todo)
      return res.status(404).json({ error: 'Todo not found' })

    req.todo = todo
    next()
  }
  catch (err) { next(err) }
}

module.exports = { setTodo }