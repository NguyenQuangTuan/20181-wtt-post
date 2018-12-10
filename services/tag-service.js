const async = require('async')
const config = require('../config/config')

module.exports = class TagService {
  constructor(tag_repository) {
    this.tag_repository = tag_repository

    this.find_all = this.find_all.bind(this)
  }

  find_all(callback) {
    async.retry(
      config.retry,
      async.apply(this.tag_repository.find_all),
      (err, tags) => {
        return callback(err, tags)
      }
    )
  }
}