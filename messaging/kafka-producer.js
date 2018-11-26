const kafka = require('no-kafka')
const uuid = require('uuid/v4')

module.exports = class KafkaProducer {
  constructor(options, default_topics) {
    this.producer = new kafka.Producer(options)
    this.default_topics = default_topics
    this.producer.init()

    this.send = this.send.bind(this)
  }

  send(topic, key, value, callback) {
    topic = topic || this.default_topics
    value.uuid = uuid()
    // value.source = SERVICE_NAME

    this.producer
      .send({
        topic: topic,
        message: {
          key: key,
          value: JSON.stringify(value)
        }
      })
      .then(res => {
        if (res[0].error) {
          let error = log_error(topic, key, value, res[0].error)
          callback(error)
        } else {
          // logger.debug('Message Send', {
          //   topic: topic,
          //   key: key,
          //   value: value
          // })

          callback(null, res)
        }
      })
      .catch(err => {
        let error = log_error(topic, key, value, err)
        callback(error)
      })
  }
}

log_error = (topic, key, value, err) => {
  let error = new Error(err.message, {
    topic: topic,
    key: key,
    value: value
  }, err)

  console.error('KafkaProducer send()', error)

  return error
}
