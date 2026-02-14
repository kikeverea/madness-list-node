const { List } = require('../../models')

const setList = async (req, res, next, id) => {
  try {
    const list = await List.findByPk(id)

    if (!list)
      return res.status(404).json({ error: 'List not found' })

    req.list = list
    next()
  }
  catch (err) { next(err) }
}

module.exports = { setList }