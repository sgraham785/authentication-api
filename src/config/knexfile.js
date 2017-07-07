import { } from 'dotenv'

export default {
  client: 'pg',
  debug: true,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    searchPath: process.env.DB_SCHEMAS
  }
}
