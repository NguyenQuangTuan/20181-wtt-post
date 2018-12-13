const async = require('async')
const lodash = require('lodash')
const config = require('../config/config')
const SubReviewEvent = require('../domain-models/event/sub-review-event')

module.exports = class SubReviewService {
  constructor(sub_review_repository, review_repository, post_repository, message_producer) {
    this.sub_review_repository = sub_review_repository
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
      async.apply(this.sub_review_repository.find_all, condition, select, offset, limit, order_by),
      (err, sub_reviews) => {
        return callback(err, sub_reviews)
      }
    )
  }

  create(sub_review, callback) {
    let { review_id, post_id } = sub_review

    async.waterfall([
      cb => {
        async.parallel({
          post: cb2 => {
            async.retry(
              config.retry,
              async.apply(this.post_repository.find_one, { post_id }, []),
              (err, post) => {
                return cb2(err, post)
              }
            )
          },
          review: cb2 => {
            async.retry(
              config.retry,
              async.apply(this.review_repository.find_one, { review_id }, null),
              (err, review) => {
                return cb2(err, review)
              }
            )
          }
        }, (err, results) => {
          if (err) return cb(err)
          else if (!results.post || !results.review) return cb({ type: 'Not Found' })
          else return cb(null, results.review)
        })
      },
      (review, cb) => {
        async.retry(
          config.retry,
          async.apply(this.sub_review_repository.create, sub_review),
          (err, created) => {
            if (err) return cb(err)
            else if (!created) return cb({ type: 'Request Failed' })
            else return cb(null, review, created)
          }
        )
      },
      (review, sub_review, cb) => {
        let publish_obj = {
          action: SubReviewEvent.SUB_REVIEW_CREATED,
          payload: {
            sub_review,
            review
          }
        }

        async.retry(
          config.retry,
          async.apply(this.message_producer.send, null, publish_obj.payload.sub_review.sub_review_id, publish_obj),
          err => {
            return cb(err, sub_review)
          }
        )
      }
    ], (err, sub_review) => {
      return callback(err, sub_review)
    })
  }

  update(sub_review_id, sub_review, callback) {
    let { user_id } = sub_review

    async.waterfall([
      cb => {
        let condition = {
          user_id, sub_review_id
        }
        async.retry(
          config.retry,
          async.apply(this.sub_review_repository.find_one, condition, null),
          (err, sub_review) => {
            if (err) return cb(err)
            else if (!sub_review) return cb({ type: 'Not Found' })
            else return cb(null)
          }
        )
      },
      cb => {
        async.retry(
          config.retry,
          async.apply(this.sub_review_repository.update, sub_review_id, sub_review),
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

  delete(sub_review_id, callback) {
    async.retry(
      config.retry,
      async.apply(this.sub_review_repository.delete, sub_review_id),
      (err, deleted) => {
        return callback(err, deleted)
      }
    )
  }
}