import 'dotenv/config'
import app from './src/app'
import db from './src/db/sequelize'

const PORT = process.env.PORT

db.connect()
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))