module.exports = class TagController {
  constructor(tag_service) {
    this.tag_service = tag_service

    this.find_all = this.find_all.bind(this)
  }

  find_all(req, res, next) {
    this.tag_service.find_all((err, tags) => {
      if (err) return next(err)
      else {
        res.tags = { tags }
        next()
      }
    })
  }
}