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

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.creare = this.creare.bind(this)
    this.update = this.update.bind(this)
    this.detele = this.detele.bind(this)
  }

  find_all(req, res, next) {
    let condition = {}
    let select = req.fields ? req.fields.split(' ') : null
    let offset = req.options.offset || req.options.skip
    let limit = req.options.limit
    let order_by = req.options.sort ? req.options.sort : { created_at: -1 }

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
    let select = req.fields ? req.fields.split(' ') : null

    this.post_service.find_one(condition, select, (err, post) => {
      if (err) next(err)
      else {
        res.post = { post }
        next()
      }
    })
  }

  creare(req, res, next) {
    let { post } = req.body
    this.post_service.create(post, (err, created) => {
      if (err) next(err)
      else {
        res.created = { created }
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

  detele(req, res, next) {
    let { post_id } = req.params

    this.post_service.detele(post_id, (err, deleted) => {
      if (err) next(err)
      else {
        res.deleted = { deleted }
        next()
      }
    })
  }
}