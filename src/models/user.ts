import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize
} from 'sequelize'

import bcrypt from 'bcrypt'
import { AppModels } from './types'

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  static associate(_model: AppModels) {}

  declare id: CreationOptional<number>
  declare username: string
  declare name: CreationOptional<string>
  declare lastname: CreationOptional<string>
  declare passwordHash: CreationOptional<string>

  async setPassword(password: string): Promise<void> {
    this.passwordHash = await bcrypt.hash(password, 10)
    await this.save()
  }

  async validPassword(password: string) {
    return await bcrypt.compare(password, this.passwordHash)
  }
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING },
      lastname: { type: DataTypes.STRING },
      passwordHash: { type: DataTypes.STRING },
    },
    {
      sequelize,
      underscored: true,
      timestamps: false,
      modelName: 'user',
    }
  )

  return User
}
