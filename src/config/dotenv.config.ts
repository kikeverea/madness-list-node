import dotenv from 'dotenv'

const nodeEnv = process.env.NODE_ENV ?? 'development'

const file = nodeEnv === 'test'
  ? '.env.test'
  : '.env.dev'

dotenv.config({ path: file })