import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  Sequelize,
} from 'sequelize';

export class Todo extends Model<InferAttributes<Todo>, InferCreationAttributes<Todo>> {
  static associate(models: AppModels) {
    Todo.belongsTo(models.List, { foreignKey: 'listId' });
  }

  declare id: CreationOptional<number>
  declare title: string
  declare completed: CreationOptional<boolean>
  declare listId: ForeignKey<number>
}

// import type at bottom to avoid circular type issues
import type { AppModels } from './types'

export default (sequelize: Sequelize) => {
  Todo.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      completed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      listId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      underscored: true,
      timestamps: false,
      modelName: 'todo'
    }
  );

  return Todo
}
