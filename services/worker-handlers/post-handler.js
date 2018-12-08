const async = require('async')
const config = require('../../config/config')
const FavoriteEvent = require('../../domain-models/event/favorite-event')

module.exports = class NotificationHandler {
  constructor(post_repository) {
    this.post_repository = post_repository

    this.handle = this.handle.bind(this)
  }

  handle({ action, payload }, callback) {
    switch (action) {
      case FavoriteEvent.FAVORITE_UPDATED:
        this.handle_favorite_updated(payload, callback)
        break
      default:
        return callback(null, null)
    }
  }

  handle_favorite_updated({ favorite }, callback) {
    let { post_id, like } = favorite
    async.waterfall([
      cb => {
        async.retry(
          config.retry,
          async.apply(this.post_repository.find_one, { post_id }, []),
          (err, post) => {
            return cb(err, post)
          }
        )
      },
      (post, cb) => {
        if (!post) return cb(null)
        else {
          let { total_like } = post
          if (like) total_like += 1
          else total_like -= 1

          async.retry(
            config.retry,
            async.apply(this.post_repository.update, post_id, { total_like }),
            err => {
              return cb(err)
            }
          )
        }
      }
    ], err => {
      return callback(err)
    })
  }
}