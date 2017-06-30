import { login } from './controller'
import schema from './schema'

// TODO: format & export route configs

export const v1 = {
  post: {
    '/login': login,
    '/logout': login
  },
  get: {
    '/test': (request, response) => {
      response.set('Content-Type', 'application/json')
      response.status(200).send('Here and healthy!')
    },
    '/3': login
  }
}

export const v2 = {
  post: {
    '/login': login,
    '/logout': login
  },
  get: {
    '/test': login,
    '/3': login
  }
}

/**
export default app => {
  app.post('/login', login)
  app.post('/logout')
}
 */
