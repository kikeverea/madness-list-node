import { Sequelize } from 'sequelize'

const ssl = {
  require: process.env.DATABASE_SSL,
  rejectUnauthorized: false
}

const db = process.env.DATABASE_URL

if (!db)
  throw new Error('No database database url')

export const database = new Sequelize(db, {
  dialectOptions: { ...(process.env.DATABASE_SSL === 'true' ? { ssl } : {}) },
  logging: false
})

const connect = async () => {
  try {
    await database.authenticate()
    await database.sync({ alter: process.env.NODE_ENV !== 'production', force: process.env.NODE_ENV !== 'production' })
  }
  catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

const disconnect = async () => {
  try {
    await database.close()
    console.log('Connection has been closed successfully.')
  }
  catch (error) {
    console.error('Unable to disconnect from the database:', error)
  }
}

export default { connect, disconnect }