module.exports = class SubReviewController {
  constructor(sub_review_service) {
    this.sub_review_service = sub_review_service

    this.find_all = this.find_all.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(req, res, next) {
    let { post_id, review_id } = req.params
    let condition = { post_id, review_id }
    let select = null
    let offset = req.options.offset || req.options.skip
    let limit = req.options.limit
    let order_by = [['created_at', 'desc']]

    this.sub_review_service.find_all(condition, select, offset, limit, order_by, (err, sub_reviews) => {
      if (err) next(err)
      else {
        res.sub_reviews = { sub_reviews }
        next()
      }
    })
  }

  create(req, res, next) {
    let { user_id, full_name } = req.authen_user
    let { sub_review } = req.body
    let { review_id, post_id } = req.params
    sub_review = Object.assign(sub_review, { user_id, review_id, post_id, full_name })

    this.sub_review_service.create(sub_review, (err, created) => {
      if (err) next(err)
      else {
        res.created = { sub_review: created }
        next()
      }
    })
  }

  update(req, res, next) {
    let { user_id } = req.authen_user
    let { sub_review } = req.body
    let { sub_review_id } = req.params
    sub_review = Object.assign(sub_review, { user_id })

    this.sub_review_service.update(sub_review_id, sub_review, (err, updated) => {
      if (err) next(err)
      else {
        res.updated = { updated }
        next()
      }
    })
  }

  delete(req, res, next) {
    let { sub_review_id } = req.params

    this.sub_review_service.delete(sub_review_id, (err, deleted) => {
      if (err) next(err)
      else {
        res.deleted = { deleted }
        next()
      }
    })
  }
}