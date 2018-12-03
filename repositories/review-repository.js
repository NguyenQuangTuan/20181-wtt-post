module.exports = class PostRepository {
  constructor(db_context) {
    this.db_context = db_context
    this.Review = db_context.Review

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(condition = {}, select = null, offset = 0, limit = null, order_by = null, callback) {
    this.Review
      .findAll({
        attribute: select,
        where: condition,
        limit: limit,
        offset: offset * limit,
        order_by: order_by
      })
      .then(res => {
        res = res.map(ck => ck.dataValues)
        callback(null, res)
        return null
      })
      .catch(err => {
        console.error(err)
        callback(err)
        return null
      })
  }

  find_one(condition = {}, select = null, callback) {
    this.Review
      .findOne({
        where: condition,
        attribute: select
      })
      .then(res => {
        callback(null, res ? res.dataValues : null)
        return null
      })
      .catch(err => {
        console.error(err)
        callback(err)
        return null
      })
  }

  create(review, callback) {
    this.Review
      .create(review)
      .then(res => {
        callback(null, res ? res.dataValues : null)
        return null
      })
      .catch(err => {
        console.error(err)
        callback(err)
        return null
      })
  }

  update(review_id, review, callback) {
    this.Review
      .update(
        review,
        { where: { review_id } }
      )
      .then(res => {
        callback(null, res.every(val => val === 1))
        return null
      })
      .catch(err => {
        console.error(err)
        callback(err)
        return null
      })
  }

  delete(review_id, callback) {
    this.Review
      .destroy({
        where: { review_id }
      })
      .then(res => {
        callback(null, res > 0 ? true : false)
        return null
      })
      .catch(err => {
        console.error(err)
        callback(err)
        return null
      })
  }
}