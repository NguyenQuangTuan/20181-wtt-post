const dependencies = {
  parser_instance: null
}

const TextParser = function (parser_instance) {
  dependencies.parser_instance = parser_instance
}

TextParser.prototype.parse = (message) => {
  return dependencies.parser_instance ?
      dependencies.parser_instance.parse(message).toString('utf8') :
      message.toString('utf8')
}

module.exports = TextParser
