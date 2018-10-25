/**
 * Tầng Service:
 * - Nhiệm vụ: Là nơi xử lý logic, tầng service nhận dữ liệu đã đc chuẩn hóa 
 * ở tầng controller bên trên và nó chỉ quan tâm tới việc xử lý logic nghiệp 
 * vụ, nếu 1 trường bắt buộc là số int thì vào đến service nó phải là int,
 * nếu không phải int nó đã bị chặn và trả về lỗi ở tầng controller và validate 
 * ở trên rồi
 */

const async = require('async')
const config = require('../config/config')

module.exports = class {
  constructor(post_repository) {
    this.post_repository = post_repository

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.creare = this.creare.bind(this)
    this.update = this.update.bind(this)
    this.detele = this.detele.bind(this)
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

  creare(post, callback) {
    // Do something
    async.retry(
      config.retry,
      async.apply(this.post_repository.creare, post, (err, creared) => {
        return callback(err, creared)
      })
    )
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

  detele(post_id, callback) {
    async.retry(
      config.retry,
      async.apply(this.post_repository.detele, post_id),
      (err, deleted) => {
        return callback(err, deleted)
      }
    )
  }
}