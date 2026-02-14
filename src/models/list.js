const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {

  class List extends Model {
    static associate(models) {
      List.hasMany(models.Todo)
    }
  }

  List.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'todo'
  })

  return List
}

