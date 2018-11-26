const config = require('../config/config')
const KafkaProducer = require('../messaging/kafka-producer')
const PostEvent = require('../domain-models/event/post-event')

const kafka_producer = new KafkaProducer(config.message_producer.options, config.message_producer.topic)

let publish_obj = {
  action: PostEvent.POST_CREATED,
  payload: {
    post: {
      a: 'lala'
    }
  }
}

kafka_producer.send('tuan-wtt', 123, publish_obj, (err, res) => {
  if (err) console.log(err)
  else console.log(res)
})