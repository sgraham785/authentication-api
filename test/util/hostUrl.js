import { } from 'dotenv'

console.log(process.env.SERVER_HOST)
export default () => (`https://${process.env.SERVER_HOST}:${process.env.SERVER_HTTPS_PORT}/`)
