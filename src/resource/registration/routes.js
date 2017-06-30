import { register, verify } from './controller'
import schema from './schema'

// TODO: format & export route configs
export const v1 = {
  post: {
    '/': register,
    '/verify': verify
  }
}
