const { Sequelize } = require('sequelize')

const ssl = process.env.DATABASE_SSL === 'true'
  ? {
      ssl: {
        require: process.env.DATABASE_SSL,
        rejectUnauthorized: false
      }
    }
  : {}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ...ssl
  },
})

const connect = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    return sequelize.close()
  }
  catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

module.exports = { connect, sequelize }