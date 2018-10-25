module.exports = {
  aggregate: (is_valid) => {
    if (is_valid === true) return { is_valid }
    else {
      let errors = {}
      is_valid.map((error) => {
        errors[error.field] = [error.message]
      })
      return { is_valid: false, errors }
    }
  }
}
