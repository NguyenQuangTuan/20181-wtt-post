const shortid = require('shortid')
const moment = require('moment')
const util = require('../../utils/index')

module.exports = class Post {
  constructor(params) {
    let props = Object.assign({
      post_id: shortid.generate(),
      rating_average: 0,
      total_review: 0
    }, params)

    this.post_obj = {
      post_id: props.post_id,
      title: props.title,
      content: props.content,
      short_content: handle_short_content(props.content),
      user_id: props.user_id,
      rating_average: props.rating_average,
      total_review: props.total_review,
      tags: props.tags,
      created_at: handle_created_at(props.created_at),
      updated_at: handle_updated_at(props.updated_at)
    }

  }

  get post() {
    return this.post_obj
  }
}

const handle_short_content = (content) => {
  let new_content = util.parse_html(content)
  let short_content = new_content.trim().substr(0, 146)
  short_content += ' ...'
  return short_content
}

const handle_created_at = (created_at) => {
  if (created_at) return created_at
  else return moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ")
}

const handle_updated_at = (updated_at) => {
  if (updated_at) return updated_at
  else return moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ")
}
