module.exports = class ReviewController {
  constructor(review_service) {
    this.review_service = review_service

    this.find_all = this.find_all.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(req, res, next) {
    let { post_id } = req.params
    let condition = { post_id }
    let select = null
    let offset = req.options.offset || req.options.skip
    let limit = req.options.limit
    let order_by = [['created_at', 'desc']]

    this.review_service.find_all(condition, select, offset, limit, order_by, (err, reviews) => {
      if (err) next(err)
      else {
        res.reviews = { reviews }
        next()
      }
    })
  }

  create(req, res, next) {
    let { user_id, full_name } = req.authen_user
    let { review } = req.body
    let { post_id } = req.params
    review = Object.assign(review, { user_id, post_id, full_name })

    this.review_service.create(review, (err, created) => {
      if (err) next(err)
      else {
        res.created = { review: created }
        next()
      }
    })
  }

  update(req, res, next) {
    let { user_id } = req.authen_user
    let { review } = req.body
    let { post_id, review_id } = req.params
    review = Object.assign(review, { user_id, post_id })

    this.review_service.update(review_id, review, (err, updated) => {
      if (err) next(err)
      else {
        res.updated = { updated }
        next()
      }
    })
  }

  delete(req, res, next) {
    let { review_id } = req.params

    this.review_service.delete(review_id, (err, deleted) => {
      if (err) next(err)
      else {
        res.deleted = { deleted }
        next()
      }
    })
  }
}