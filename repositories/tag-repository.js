module.exports = class TagRepository {
  constructor(db_context) {
    this.db_context = db_context
    this.Tag = db_context.Tag

    this.find_all = this.find_all.bind(this)
  }

  find_all(callback) {
    this.Tag
      .findAll({})
      .then(res => {
        callback(null, res && res.map(item => item.dataValues))
        return null
      })
      .catch(err => {
        console.error(err)
        callback(err)
        return null
      })
  }
}