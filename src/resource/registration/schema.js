import Joi from 'joi'

/**
 * (?=.*[a-z]) must contain at least 1 lowercase alphabetical character
 * (?=.*[A-Z]) must contain at least 1 uppercase alphabetical character
 * (?=.*[0-9]) must contain at least 1 numeric character
 * (?=.*[!@#\$%\^&\*]) contain at least one special character, we are escaping reserved RegEx characters to avoid conflict
 * (?=.{6,}) must be eight characters or longer
 */
let passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})')

export default Joi.object().options({ abortEarly: false }).keys({
  uuid: Joi.string().uuid().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().regex(passwordRegex).required(),
  email_code: Joi.string().alphanum().required(),
  access_token: [Joi.string(), Joi.number()]
}).without('password', 'access_token')
