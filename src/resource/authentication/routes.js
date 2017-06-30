import { login } from './controller'

export const v1 = {
  post: {
    /**
   * @swagger
   * definitions:
   *   Login:
   *     required:
   *       - username
   *       - password
   *     properties:
   *       username:
   *         type: string
   *       password:
   *         type: string
   *       path:
   *         type: string
   */

  /**
   * @swagger
   * tags:
   *   name: Users
   *   description: User management and login
   */

  /**
   * @swagger
   * tags:
   *   - name: Login
   *     description: Login
   *   - name: Accounts
   *     description: Accounts
   */

  /**
   * @swagger
   * /login:
   *   post:
   *     description: Login to the application
   *     tags: [Users, Login]
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/username'
   *       - name: password
   *         description: User's password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: login
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Login'
   */
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
