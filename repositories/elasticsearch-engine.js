const elasticsearch = require('elasticsearch')

// REF: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html

const Elasticsearch = function (config) {
  let { host, log } = config
  this.client = new elasticsearch.Client({ host, log })

  return this
}

module.exports = Elasticsearch
