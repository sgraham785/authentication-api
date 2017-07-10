import { registration, verifyEmail } from './controller'

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
    /**
     * @swagger
     * definitions:
     *   VerifyEmail:
     *     required:
     *       - timestamp
     *       - email_code
     *     properties:
     *       timestamp:
     *         type: string
     *         example: 1499647625
     *       email_code:
     *         type: string
     *         example: 70ug5czfw2ltbj4i
     */

    /**
     * @swagger
     * tags:
     *   - registration
     *   - email
     *   - verification
     */

    /**
     * @swagger
     * /v1/registration/verify/{timestamp}/{email_code}:
     *   post:
     *     description: Verify link emailed to a user
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: timestamp
     *         description: Generated timestamp, must be less then 30 day old.
     *         in: path
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/Email_Verification/properties/timestamp'
     *       - name: email_code
     *         description: Generated email code.
     *         in: path
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/Email_Verification/properties/email_code'
     *     responses:
     *       200:
     *         description: Successful email verification
     *       422:
     *         description: User not found
     */
    '/verify/:timestamp/:email_code': verifyEmail
  }
}
