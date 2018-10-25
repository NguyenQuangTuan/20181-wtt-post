/**
 * Tầng repository:
 * - Là tầng thao tác với cơ sở dữ liệu. Việc thao tác với CSDL mình dùng 
 * thư viện sequelize nên không phải viết câu lệnh sql. Tầng này chủ yếu 
 * phục vụ cho tầng service. Các hàm cơ bản mà tầng này cung cấp là get, 
 * create, update, delete, tùy từng nghiệp vụ mà có thể  thêm 1 số hàm
 */

const until = require('../utils/index')

module.exports = class PostRepository {
  constructor(db_context) {
    this.db_context = db_context
    this.Post = db_context.Post

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.creare = this.creare.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(condition = {}, select = null, offset = 0, limit = null, order_by = null, callback) {
    this.Post
      .findAll({
        attribute: select,
        where: condition,
        limit: limit,
        offset: offset * limit,
        order_by: order_by,
      })
      .then(res => {
        res = res.map(ck => parse_obj(ck))
        callback(null, res)
        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  find_one(condition = {}, select = null, callback) {
    this.Post
      .findOne({
        where: condition,
        attribute: select,
      })
      .then(res => {
        if (!res) {
          callback(null, null)
          return null
        }
        else {
          res = parse_obj(res)
          callback(null, res)
          return null
        }
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  creare(post, callback) {
    this.Post
      .creare(post)
      .then(res => {
        if (!res) return callback(null, null)
        else {
          res = until.parse_object(res.dataValues)
          callback(null, res)
          return null
        }
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  update(post_id, post, callback) {
    this.Post
      .update(
        until.stringify_object(post),
        { where: { post_id } }
      )
      .then(res => {
        callback(null, res.every(val => val == 1))
        return null
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }

  delete(post_id, callback) {
    this.Post
      .destroy({
        where: { post_id }
      })
      .then(res => {
        callback(null, res == 1 ? true : false)
      })
      .catch(err => {
        console.log(err)
        callback(err)
        return null
      })
  }
}

