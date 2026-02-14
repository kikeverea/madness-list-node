const { sequelize } = require('../db/sequelize')

const List = require('./list')(sequelize)
const Todo = require('./todo')(sequelize)

const index = { List, Todo }

Object.values(index).forEach((m) => m.associate?.(index))

module.exports = { ...index, sequelize }