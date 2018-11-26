const kafka = require('no-kafka')

module.exports = class KafkaConsumer {
  constructor(parser_instance, options, topics, timeout, handler_callback, handler_name) {
    let consumer = new kafka.GroupConsumer(options)
    let strategies = {
      subscriptions: topics,
      strategy: new kafka.ConsistentAssignmentStrategy(),
      handler: async (messageSet, topic, partition) => {
        for (let { message, offset } of messageSet) {
          try {
            let { uuid, action, source } = await new Promise((resolve, reject) => {
              // Try parse content to json
              let content = ''
              try {
                content = message && parser_instance.parse(message.value)
              }
              catch (err) {
                console.warn(`Error when parsing message by ${handler_name} - ${action} from ${source} - topic:partition:offset ${topic}:${partition}:${offset} - content: ${content} - ${err.toString()}`)
                return reject()
              }

              // Processing message
              let { uuid, action, source } = content
              // if (!uuid) reject(new Error('Missing uuid from message', { content, topic, partition, offset }, null))
              // namespace.set('uuid', uuid)

              console.info(`Processing by ${handler_name} - ${action} from ${source} - topic:partition:offset ${topic}:${partition}:${offset}`)
              handler_callback(content, err => {
                if (err)
                  return reject(new Error(err.message, { content, topic, partition, offset }, err))
                else
                  return resolve({ uuid, action, source })
              })

            })

            console.info(`DONE by ${handler_name} - ${action} from ${source} - topic:partition:offset ${topic}:${partition}:${offset}`)
            consumer.commitOffset({ topic, partition, offset })

          }
          catch (err) {
            console.error(`KafkaConsumer handler()`, err)

            consumer.commitOffset({ topic, partition, offset })
          }
        }
      },
      metadata: options.metadata
    }

    consumer.init(strategies)
  }
}
