const role = require('../../../domain-models/role')

exports.check_admin = function (req, res, next) {
  if (req.authen_user.role && req.authen_user.role == role.ADMIN) {
    req.authen_valid = true
    next()
  }
  else {
    next({ type: 'Unauthorized' })
  }
}

exports.check_user = function (req, res, next) {
  if (req.authen_user.role && req.authen_user.role == role.USER) {
    req.authen_valid = true
    next()
  }
  else {
    next({ type: 'Unauthorized' })
  }
}

exports.check_shipper = function (req, res, next) {
  if (req.authen_user.role && req.authen_user.role == role.SHIPPER) {
    req.authen_valid = true
    next()
  }
  else {
    next({ type: 'Unauthorized' })
  }
}

exports.check_warehouse_keeper = function (req, res, next) {
  if (req.authen_user.role && req.authen_user.role == role.WAREHOUSE_KEEPER) {
    req.authen_valid = true
    next()
  }
  else {
    next({ type: 'Unauthorized' })
  }
}