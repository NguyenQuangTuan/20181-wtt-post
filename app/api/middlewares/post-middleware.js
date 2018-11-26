const validator = require('../../../validators/post-validators')

const validate = {
  post: post => validator.validate_post({ post })
}

// gọi hàm validator và chuẩn lại mã lỗi trả về nếu có lỗi 
const conduct_validating = validatees => {
  let validatees_keys = Object.keys(validatees)
  for (let i = 0; i < validatees_keys.length; i++) {
    let validatee = validatees_keys[i]

    if (!validatees[validatee]) continue
    let result = validate[validatee](validatees[validatee])
    if (!result.is_valid) return ({ type: 'Bad Request', detail: result.errors })
  }

  return null
}

module.exports = {
  validate_create: (req, res, next) => {
    let { post } = req.body

    let validatees = { post }
    let err = conduct_validating(validatees)

    if (err) next(err)
    else next()
  },
  
  validate_update: (req, res, next) => {
    let { post } = req.body

    let validatees = { post }
    let err = conduct_validating(validatees)

    if (err) next(err)
    else next()
  }
}