import { Sequelize } from 'sequelize'

let sequelize: Sequelize | null = null

const getDatabaseName = (): string => {
  const workerId = process.env.JEST_WORKER_ID ?? '1'
  return `test_db_worker_${workerId}`
}

const swapDatabaseNames = (adminUrl: string, newName: string): URL => {
  const newUrl = new URL(adminUrl)
  newUrl.pathname = `/${newName}`

  return newUrl
}

const createDatabase = async (adminDBUrl: string, databaseName: string) => {
  const adminDB = new Sequelize(adminDBUrl, { logging: false })

  try {
    await adminDB.query(`CREATE DATABASE "${databaseName}"`);
    console.log('spawning database', databaseName)
  }
  catch (err: any) {
    if (err?.original?.code !== '42P04')  // 42P04 = duplicate_database
      throw err
  }

  await adminDB.close()
}

export const getDatabaseForWorker = async (): Promise<Sequelize> => {
  if (sequelize)
    return sequelize

  const adminDBUrl = process.env.DATABASE_URL
  if (!adminDBUrl) throw new Error('No database database url')

  const databaseName = getDatabaseName()
  await createDatabase(adminDBUrl, databaseName)

  const workerUrl = swapDatabaseNames(adminDBUrl, databaseName)
  sequelize = new Sequelize(workerUrl.toString(), { logging: false })

  return sequelize
}