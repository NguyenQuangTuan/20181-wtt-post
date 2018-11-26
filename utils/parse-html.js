const htmlencode = require('htmlencode')

module.exports = function parse_html(obj) {
  obj = htmlencode.htmlDecode(obj)
  obj = obj.replace(/<[^<]*>|\\[^]/gi, '')

  return obj
}