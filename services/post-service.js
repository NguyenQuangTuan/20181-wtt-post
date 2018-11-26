const async = require('async')
const config = require('../config/config')
const Post = require('../domain-models/post/post')
const PostEvent = require('../domain-models/event/post-event')

module.exports = class {
  constructor(post_repository, message_producer) {
    this.post_repository = post_repository
    this.message_producer = message_producer

    this.autocomplete = this.autocomplete.bind(this)
    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  autocomplete(condition, select, offset, limit, callback) {
    async.retry(
      config.retry,
      async.apply(this.post_repository.autocomplete, condition, select, offset, limit),
      (err, posts) => {
        return callback(err, posts)
      }
    )
  }

  find_all(condition, select, offset, limit, order_by, callback) {
    async.retry(
      config.retry,
      async.apply(this.post_repository.find_all, condition, select, offset, limit, order_by),
      (err, posts) => {
        return callback(err, posts)
      }
    )
  }

  find_one(condition, select, callback) {
    async.retry(
      config.retry,
      async.apply(this.post_repository.find_one, condition, select, (err, post) => {
        if (err) return callback(err)
        else if (!post) return callback({ type: 'Not Found' })
        else return callback(null, post)
      })
    )
  }

  create(post, callback) {
    post = new Post(post).post
    let { post_id } = post

    async.waterfall([
      cb => {
        async.retry(
          config.retry,
          async.apply(this.post_repository.create, post, (err, created) => {
            return cb(err, created)
          })
        )
      },
      (created, cb) => {
        if (!created) return cb({ type: 'Request Failed' })
        let publish_obj = {
          action: PostEvent.POST_CREATED,
          payload: {
            post
          }
        }

        async.retry(
          config.retry,
          async.apply(this.message_producer.send, null, post_id, publish_obj),
          err => {
            return cb(err, post)
          }
        )
      }
    ], (err, post) => {
      return callback(err, post)
    })

  }

  update(post_id, post, callback) {
    async.retry(
      config.retry,
      async.apply(this.post_repository.update, post_id, post),
      (err, updated) => {
        return callback(err, updated)
      }
    )
  }

  delete(post_id, callback) {
    async.retry(
      config.retry,
      async.apply(this.post_repository.delete, post_id),
      (err, deleted) => {
        return callback(err, deleted)
      }
    )
  }
}