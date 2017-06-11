import Joi from 'joi'

export default {
  email: Joi.string().email().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  access_token: [Joi.string(), Joi.number()]
}
