import { } from 'dotenv'
let debug = process.env.NODE_ENV === 'development'

export default {
  client: 'pg',
  debug,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: 'users_app_owner', // process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    searchPath: process.env.DB_SCHEMAS
  }
}
