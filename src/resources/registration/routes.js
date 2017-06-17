import controller from './controller'
import schema from './schema'

// TODO: format & export route configs
export default {
  post: {
    '/': controller.create({
      schema
    })
  }
}
