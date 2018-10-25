const errors_aggregator = require('./errors-aggregator')
const Validator = require('fastest-validator')

const additional_error_messages = {
  authen_user: 'Requested user is not valid!'
}

const validator = new Validator({ messages: additional_error_messages })

// Schemas
let post = {
  type: 'object',
  props: {
    
  }
}

// Validators
let validate_post = validator.compile({ post })

module.exports = {
  validate_post: (request) => {
    return errors_aggregator.aggregate(validate_post(request))
  }
}