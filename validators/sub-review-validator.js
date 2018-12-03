const errors_aggregator = require('./errors-aggregator')
const Validator = require('fastest-validator')

const additional_error_messages = {
  authen_user: 'Requested user is not valid!'
}

const validator = new Validator({ messages: additional_error_messages })

// Schemas
let sub_review = {
  type: 'object',
  props: {
    content: { type: 'string' },
  }
}

// Validators
let validate_sub_review = validator.compile({ sub_review })

module.exports = {
  validate_sub_review: (request) => {
    return errors_aggregator.aggregate(validate_sub_review(request))
  }
}