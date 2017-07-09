import { login } from './controller'

export const v1 = {
  post: {
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
     *         format: email
     *         example: example@email.com
     *       password:
     *         type: string
     *         format: password
     *         example: s3cur3Pa$$word
     *     example:
     *       email: example@email.com
     *       password: s3cur3Pa$$word
     */

    /**
     * @swagger
     * tags:
     *   - login
     */

    /**
     * @swagger
     * /v1/authentication/:
     *   post:
     *     description: Login to the application
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: payload
     *         description: Login object payload.
     *         in: body
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/Login'
     *     responses:
     *       200:
     *         description: Successful login
     *       400:
     *         description: Email or Password not in body
     *       422:
     *         description: User email not found
     */
    '/': login,
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
