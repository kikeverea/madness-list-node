import { Sequelize } from 'sequelize'

const db = process.env.DATABASE_URL

if (!db)
  throw new Error('No sequelize database url')

const ssl = process.env.DATABASE_SSL === 'true'
  ? {
      ssl: {
        require: process.env.DATABASE_SSL,
        rejectUnauthorized: false
      }
    }
  : {}

export const sequelize = new Sequelize(db, {
  dialectOptions: { ...ssl },
})

const connect = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' })

    console.log('Connection has been established successfully.')
  }
  catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export default { connect }