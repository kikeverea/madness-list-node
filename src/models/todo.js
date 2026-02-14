const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {

  class Todo extends Model {
    static associate(models) {
      Todo.belongsTo(models.List)
    }
  }

  Todo.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
    },
    completed: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'todo'
  })

  return Todo
}
