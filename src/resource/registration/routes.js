import { registration, verify } from './controller'

export const v1 = {
  post: {
    /**
     * @swagger
     * definitions:
     *   Registration:
     *     type: object
     *     required:
     *       - email
     *       - password
     *     properties:
     *       first_name:
     *         type: string
     *         example: John
     *       last_name:
     *         type: string
     *         example: Smith
     *       email:
     *         type: string
     *         format: email
     *         example: example@email.com
     *       password:
     *         type: string
     *         format: password
     *         example: s3cur3Pa$$word
     *     example:
     *       first_name: John
     *       last_name: Smith
     *       email: example@email.com
     *       password: s3cur3Pa$$word
     */

    /**
     * @swagger
     * tags:
     *   - registration
     */

    /**
     * @swagger
     * /v1/registration/:
     *   post:
     *     description: Register a user to the application
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: payload
     *         description: Object payload.
     *         in: body
     *         required: true
     *         type: object
     *         schema:
     *           $ref: '#/definitions/Registration'
     *     responses:
     *       200:
     *         description: Successful registration returns token
     *       422:
     *         description: User email not found
     */
    '/': registration,
    '/verify': verify
  }
}
