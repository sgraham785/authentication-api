import { login } from './controller'

export const v1 = {
  post: {
    // TODO: fix swagger definition
    /**
     * @swagger
     * definitions:
     *   Login:
     *     required:
     *       - email
     *       - password
     *     properties:
     *       email:
     *         type: string
     *         example: example@email.com
     *       password:
     *         type: string
     *         example: s3cur3Pa$$word
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
     * /v1/authentication/login:
     *   post:
     *     description: Login to the application
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: email
     *         description: Email to use for login.
     *         in: body
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/Login/properties/email'
     *       - name: password
     *         description: User's password.
     *         in: body
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/Login/properties/password'
     *     responses:
     *       200:
     *         description: Successful login
     *       400:
     *         description: Email or Password not in body
     *       422:
     *         description: User email not found
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
