module.exports = class PostRepository {
  constructor(db_context) {
    this.db_context = db_context
    this.SubReview = db_context.SubReview

    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  find_all(condition = {}, select = null, offset = 0, limit = null, order_by = null, callback) {
    this.SubReview
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
    this.SubReview
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

  create(sub_review, callback) {
    this.SubReview
      .create(sub_review)
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

  update(sub_review_id, sub_review, callback) {
    this.SubReview
      .update(
        sub_review,
        { where: { sub_review_id } }
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

  delete(sub_review_id, callback) {
    this.SubReview
      .destroy({
        where: { sub_review_id }
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