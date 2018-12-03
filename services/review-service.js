const async = require('async')
const config = require('../config/config')
const ReviewEvent = require('../domain-models/event/review-event')

module.exports = class ReviewService {
  constructor(review_repository, post_repository, message_producer) {
    this.review_repository = review_repository
    this.post_repository = post_repository
    this.message_producer = message_producer

    this.find_all = this.find_all.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(condition, select, offset, limit, order_by, callback) {
    async.retry(
      config.retry,
      async.apply(this.review_repository.find_all, condition, select, offset, limit, order_by),
      (err, reviews) => {
        return callback(err, reviews)
      }
    )
  }

  create(review, callback) {
    async.waterfall([
      cb => {
        let { post_id } = review
        async.retry(
          config.retry,
          async.apply(this.post_repository.find_one, { post_id }, []),
          (err, post) => {
            if (err) return cb(err)
            else if (!post) return cb({ type: 'Not Found' })
            else return cb(null)
          }
        )
      },
      cb => {
        async.retry(
          config.retry,
          async.apply(this.review_repository.create, review),
          (err, created) => {
            if (err) return cb(err)
            else if (!created) return cb({ type: 'Request Failed' })
            else return cb(null, created)
          }
        )
      },
      (review, cb) => {
        let publish_obj = {
          action: ReviewEvent.REVIEW_CREATED,
          payload: {
            review
          }
        }

        async.retry(
          config.retry,
          async.apply(this.message_producer.send, null, publish_obj.payload.review.review_id, publish_obj),
          err => {
            return cb(err, review)
          }
        )
      }
    ], (err, review) => {
      return callback(err, review)
    })
  }

  update(review_id, review, callback) {
    let { post_id, user_id } = review

    async.waterfall([
      cb => {
        let condition = {
          post_id, user_id, review_id
        }
         async.retry(
          config.retry,
          async.apply(this.review_repository.find_one, condition, null),
          (err, review) => {
            if (err) return cb(err)
            else if (!review) return cb({ type: 'Not Found' })
            else return cb(null)
          }
        )
      },
      cb => {
        async.retry(
          config.retry,
          async.apply(this.review_repository.update, review_id, review),
          (err, updated) => {
            if (err) return cb(err)
            else if (!updated) return cb({ type: 'Request Failed' })
            else return cb(null, updated)
          }
        )
      }
    ], (err, updated) => {
      return callback(err, updated)
    })
  }

  delete(review_id, callback) {
    async.retry(
      config.retry,
      async.apply(this.review_repository.delete, review_id),
      (err, deleted) => {
        return callback(err, deleted)
      }
    )
  }
}