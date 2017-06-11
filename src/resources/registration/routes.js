import controller from './controller'
import schema from './schema'

export default {
  post: {
    '/': controller.create({
      schema
    })
  }
}
