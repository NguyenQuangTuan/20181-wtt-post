const config = require('../../config/config')
const workers = require('../../config/workers/' + process.env.NODE_ENV)

// Data Context
const mysql_data_context = require('../../repositories/mysql-context')(config.mysql)

// Repositories


// External Services


// Message Queue
const KafkaProducer = require('../../messaging/kafka-producer')

const kafka_producer = new KafkaProducer(config.message_producer.options, config.message_producer.topic)

// Services

// Handlers
const NotificationHandler = require('../../services/worker-handlers/notification-handler')

const notification_handler = new NotificationHandler()

const handlers = { notification_handler }

// Consumer
const KafkaConsumer = require('../../messaging/kafka-consumer')

// Parsers
const JsonParser = require('../../messaging/parser/json-parser')
const TextParser = require('../../messaging/parser/text-parser')

// Workers
workers.forEach((worker) => {
  let parsers = worker.parser_instances.split(',')
  let parser_instance = null
  for (let i = 0; i < parsers.length; i++) {
    switch (parsers[i]) {
      case 'TEXT':
        parser_instance = new TextParser(parser_instance)
        break
      case 'JSON':
        parser_instance = new JsonParser(parser_instance)
        break
      default:
        return null
    }
  }

  for (let i = 0; i < worker.client_instance; i++) {
    let options = {
      connectionString: worker.connection_string,
      groupId: worker.group_id,
      clientId: `${worker.prefix_client_id}`
    }

    // let namespace = cls.getNamespace(SERVICE_NAME)
    let handler = (message, callback) => {
      handlers[worker.handler].handle(message, callback)
    }
    let launcher = new KafkaConsumer(parser_instance, options, worker.topics, worker.timeout, handler, worker.handler)
    // namespace.bind(launcher)
  }

})

// Start Server
const env = process.env.NODE_ENV
console.info(`Environment: ${env}`)
