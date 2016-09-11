var controller = require('./controller')
var schema = require('./schema')
// TODO: Fix placeholder swager jsdoc
/**
 * @swagger
 * definition:
 *   NewTodos:
 *     type: object
 *     required:
 *       - text
 *     properties:
 *       text:
 *         type: string
 *   Todos:
 *     allOf:
 *       - $ref: '#/definitions/NewTodo'
 *       - required:
 *         - id
 *       - properties:
 *         id:
 *           type: integer
 *           format: int64
 */

exports.map = {
  /**
   * @swagger
   * /v1/todos:
   *   post:
   *     description: Creates todos
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: todos
   *         description: Todos object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/NewTodos'
   *     responses:
   *       200:
   *         description: todos
   *         schema:
   *           $ref: '#/definitions/Todos'
   */
  post: {
    '/': controller.create({
      schema: schema
    }),
    '/:id/relationships/:relation': controller.createRelation()
  },

  /**
   * @swagger
   * /v1/todos:
   *   get:
   *     description: Returns todos
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: todos
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Todos'
   */
  get: {
    '/': controller.read(),
    '/:id': controller.read(),
    '/:id/:related': controller.readRelated(),
    '/:id/relationships/:relation': controller.readRelation()
  },
  patch: {
    '/:id': controller.update({
      schema: schema
    }),
    '/:id/relationships/:relation': controller.updateRelation()
  },
  delete: {
    '/:id': controller.destroy(),
    '/:id/relationships/:relation': controller.destroyRelation()
  }
}
