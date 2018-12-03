const async = require('async')
const config = require('../../config/config')
const PostEvent = require('../../domain-models/event/post-event')

module.exports = class NotificationHandler {
  constructor() {

    this.handle = this.handle.bind(this)
  }

  handle({ action, payload }, callback) {
    switch (action) {
      case PostEvent.POST_CREATED:
        this.handle_post_created(payload, callback)
        break
      default:
        return callback(null, null)
    }
  }

  handle_post_created(payload, callback) {
    let { post } = payload
    console.log(post)
  }
}