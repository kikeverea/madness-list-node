import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize'
import { AppModels } from './types'

export class List extends Model<InferAttributes<List>, InferCreationAttributes<List>> {
  static associate(models: AppModels) {
    List.hasMany(models.Todo)
  }

  declare id: CreationOptional<number>
  declare name: CreationOptional<string>
}

export default (sequelize: Sequelize) => {
  List.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'list',
  })

  return List
}

