const lodash = require('lodash')

const config = require('../config/config')

module.exports = class PostRepository {
  constructor(search_engine) {
    this.search_engine_client = search_engine.client
    this.index = config.elasticsearch.index_post
    this.type = config.elasticsearch.type

    this.autocomplete = this.autocomplete.bind(this)
    this.find_all = this.find_all.bind(this)
    this.find_one = this.find_one.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  autocomplete(condition = {}, select = [], offset = 0, limit = 10, callback) {
    let { list_query_must = {} } = condition
    let must = handle_condition_autocomplete(list_query_must)

    this.search_engine_client.search({
      index: this.index,
      body: {
        _source: select,
        from: offset * limit,
        query: {
          bool: {
            must
          }
        },
        aggs: {
          top_score: {
            terms: {
              size: limit,
              field: 'title.keyword',
              order: {
                top_hit: 'desc'
              }
            },
            aggs: {
              top_hit: {
                max: {
                  script: {
                    source: '_score'
                  }
                }
              }
            }
          }

        }
      }
    })
      .then(res => {
        callback(
          null,
          res.aggregations.top_score.buckets.map(bucket => { return { title: bucket.key } })
        )
        return null
      }, err => {
        console.error(err)
        callback(err)
        return null
      })
  }

  find_all(condition = {}, select = [], offset = 0, limit = 100, order_by = [], callback) {
    let { list_query_must = {}, list_query_should = {} } = condition
    let must = handle_condition_find_all(list_query_must)
    let should = handle_condition_find_all(list_query_should)

    this.search_engine_client.search({
      index: this.index,
      body: {
        _source: select,
        from: offset * limit,
        size: limit,
        sort: order_by,
        query: {
          bool: {
            must, should
          }
        }
      }
    })
      .then(res => {
        callback(null, res.hits.hits.map(hit => hit._source), res.hits.total)
        return null
      }, err => {
        console.error(err)
        callback(err)
        return null
      })

  }

  find_one(condition = {}, select = [], callback) {
    let { post_id } = condition

    this.search_engine_client.search({
      index: this.index,
      body: {
        _source: select,
        query: { term: { post_id } }
      }
    })
      .then((res) => {
        callback(null, res.hits.hits[0] ? res.hits.hits[0]._source : null)
        return null
      }, (err) => {
        console.error(err)
        callback(err)
        return null
      })
  }

  create(post, callback) {
    this.search_engine_client.create({
      index: this.index,
      type: this.type,
      id: post.post_id,
      body: post
    })
      .then(res => {
        callback(null, (res._shards.successful == 1 && res._shards.failed == 0) ? true : false)
        return null
      }, err => {
        console.error(err)
        callback(err)
        return null
      })
  }

  update(post_id, post, callback) {
    this.search_engine_client.update({
      index: this.index,
      type: this.type,
      id: post_id,
      body: {
        doc: post
      }
    })
      .then(res => {
        callback(null, res._shards.failed == 0 ? true : false)
        return null
      }, err => {
        console.error(err)
        callback(err)
        return null
      })
  }

  delete(post_id, callback) {
    this.search_engine_client.delete({
      index: this.index,
      type: this.type,
      id: post_id
    })
      .then(res => {
        callback(null, res._shards.failed == 0 ? true : false)
        return null
      }, (err => {
        console.error(err)
        callback(err)
        return null
      }))
  }
}


const handle_condition_autocomplete = (condition) => {
  let sub_bool = []
  let condition_keys = Object.keys(condition)
  condition_keys.forEach(key => {
    switch (key) {
      case 'title': {
        sub_bool = lodash.union(sub_bool, handle_query_sub_bool('title.autocomplete', condition[key]))
        break
      }
      case 'content': {
        sub_bool = lodash.union(sub_bool, handle_query_sub_bool('content', condition[key]))
        break
      }
    }
  })

  return sub_bool
}

const handle_condition_find_all = (condition) => {
  let sub_bool = []
  let condition_keys = Object.keys(condition)
  condition_keys.forEach(key => {
    switch (key) {
      case 'post_ids': {
        sub_bool = lodash.union(sub_bool, handle_query_sub_bool('post_id', condition[key]))
        break
      }
      case 'title': {
        sub_bool = lodash.union(sub_bool, handle_query_sub_bool('title', condition[key]))
        break
      }
      case 'content': {
        sub_bool = lodash.union(sub_bool, handle_query_sub_bool('content', condition[key]))
        break
      }
      case 'user_id': {
        sub_bool = lodash.union(sub_bool, handle_query_sub_bool('user_id', condition[key]))
        break
      }
      case 'rating_average': {
        sub_bool = lodash.union(sub_bool, handle_query_sub_bool('rating_average', condition[key]))
        break
      }
      case 'tags': {
        sub_bool = lodash.union(sub_bool, handle_query_sub_bool('tags', condition[key]))
        break
      }
    }
  })

  return sub_bool
}

const handle_query_sub_bool = (match_key, match_value) => {
  let sub_bool = []
  if (lodash.isArray(match_value)) {
    match_value.forEach(ck => {
      sub_bool.push({
        match: { [match_key]: ck }
      })
    })
  }
  else {
    sub_bool.push({
      match: { [match_key]: match_value }
    })
  }

  return sub_bool
}
