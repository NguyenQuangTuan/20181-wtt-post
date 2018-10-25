const jwt = require('jsonwebtoken')
const config = require('../../../config/config')

exports.verify = function (req, res, next) {
  let token = req.headers['authorization']
  req.token = token

  jwt.verify(token, config.authen.secret, function (err, decoded) {
    if (err) {
      next({ type: 'Unauthorized' })
    }
    else {
      req.authen_user = decoded
      req.authen_valid = false
      next()
    }
  })
}

exports.check_authen_valid = function (req, res, next) {
  if (!req.authen_valid) {
    next({ type: 'Unauthorized' })
  }
  else {
    next()
  }
}