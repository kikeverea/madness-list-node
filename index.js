require('dotenv').config()
const PORT = process.env.PORT

const db = require('./src/db/sequelize')
db.connect()

const app = require('./src/app')
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))