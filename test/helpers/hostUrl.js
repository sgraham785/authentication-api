import 'dotenv/config'

const protocol = process.env.API_PROTOCOL || 'https'
const hostname = process.env.API_HOST || '0.0.0.0'
const port = process.env.API_PORT || '8443'

export default () => (`${protocol}://${hostname}:${port}`)
