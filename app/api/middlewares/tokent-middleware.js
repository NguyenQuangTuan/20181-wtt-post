const jwt = require('jsonwebtoken')
const config = require('../../../config/config')

exports.verify = function (req, res, next) {
  req.authen_user = {}
  let token = req.headers['authorization'] || req.query['access_token']
  if (token === undefined || token.trim() === '') return next({ type: 'Unauthorized' })
  req.token = token

  jwt.verify(token, config.authen.secret, function (err, decoded) {
    if (err) {
      next({ type: 'Unauthorized' })
    }
    else {
      Object.assign(req.authen_user, { ...decoded })
      next()
    }
  })
}
