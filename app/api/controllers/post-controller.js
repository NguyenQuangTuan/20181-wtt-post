/**
 * Controller: 
 * - Nhiệm vụ: điều khiển luồng xử lý, VD cùng chức năng cập nhật post, 
 * Admin có thể gửi post_id trong params nhưng thủ kho lại để post_id 
 * trong body. Ứng với mỗi TH khác nhau, tầng controller phải phát hiện và 
 * gom đầy đủ dữ liệu gửi xuống cho tầng service sử lý.
 */

module.exports = class {
  constructor(post_service) {
    this.post_service = post_service

    this.autocomplete = this.autocomplete.bind(this)
    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  autocomplete(req, res, next) {
    let { title, content } = req.query
    let list_query_must = Object.assign({}, { title, content })

    let condition = Object.assign({}, { list_query_must: handle_condition(list_query_must) })

    let select = ['title', 'post_id']
    let offset = 0
    let limit = 10

    this.post_service.autocomplete(condition, select, offset, limit, (err, posts) => {
      if (err) next(err)
      else {
        res.posts = { posts }
        next()
      }
    })
  }

  find_all(req, res, next) {
    let { post_ids, title, content, user_id, rating_average, tags } = req.query
    if (post_ids) {
      post_ids = post_ids
        .trim()
        .split(',')
        .map(post_id => post_id.trim())
    }

    if (tags) {
      tags = tags
        .trim()
        .split(',')
        .map(tag => tag.trim())
    }

    let list_query_must = Object.assign({}, { title, content, user_id, rating_average, tags })
    let list_query_should = Object.assign({}, { post_ids })
    let condition = Object.assign({}, { list_query_must: handle_condition(list_query_must) }, { list_query_should: handle_condition(list_query_should) })

    let select = req.fields ? req.fields.split(' ') : []
    let offset = req.options.offset || req.options.skip
    let limit = req.options.limit
    let order_by = req.options.sort ? req.options.sort : {}
    let order_by_keys = Object.keys(order_by)
    if (order_by_keys.length == 0) order_by = []
    if (order_by_keys.length > 0) {
      order_by = order_by_keys.map(key => ({ [key]: (order_by[key] == -1) ? 'desc' : 'asc' }))
    }

    this.post_service.find_all(condition, select, offset, limit, order_by, (err, posts) => {
      if (err) next(err)
      else {
        res.posts = { posts }
        next()
      }
    })
  }

  find_one(req, res, next) {
    let { post_id } = req.params
    let condition = { post_id }
    let select = req.fields ? req.fields.split(' ') : []

    this.post_service.find_one(condition, select, (err, post) => {
      if (err) next(err)
      else {
        res.post = { post }
        next()
      }
    })
  }

  create(req, res, next) {
    let { post } = req.body
    let { user_id } = req.authen_user
    post = Object.assign(post, { user_id })

    this.post_service.create(post, (err, created) => {
      if (err) next(err)
      else {
        res.created = { post: created }
        next()
      }
    })
  }

  update(req, res, next) {
    let { post_id } = req.params
    let { post } = req.body

    this.post_service.update(post_id, post, (err, updated) => {
      if (err) next(err)
      else {
        res.updated = { updated }
        next()
      }
    })
  }

  delete(req, res, next) {
    let { post_id } = req.params

    this.post_service.delete(post_id, (err, deleted) => {
      if (err) next(err)
      else {
        res.deleted = { deleted }
        next()
      }
    })
  }
}

const handle_condition = (list_query) => {
  let condition = {}

  let list_query_keys = Object.keys(list_query)
  list_query_keys.forEach(key => {
    if (list_query[key] != undefined) {
      condition = Object.assign(condition, { [key]: list_query[key] })
    }
  })

  return condition
}