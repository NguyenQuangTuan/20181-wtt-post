const dependencies = {
  parser_instance: null
}

const JsonParser = function (parser_instance) {
  dependencies.parser_instance = parser_instance
}

JsonParser.prototype.parse = (message) => {
  return dependencies.parser_instance ?
      JSON.parse(dependencies.parser_instance.parse(message)) :
      JSON.parse(message)
}

module.exports = JsonParser
