const express = require('express')
const body_parser = require('body-parser')
const query_handler = require('express-api-queryhandler')
const config = require('../../config/config')


// Express Setup
const app = express()
app.use(query_handler.filter())
app.use(query_handler.fields())
app.use(query_handler.pagination({ limit: 100 }))
app.use(query_handler.sort())
app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())

// Data Context
const mysql_data_context = require('../../repositories/mysql-context')(config.mysql)

// Search Engine
const elasticsearch_engine = require('../../repositories/elasticsearch-engine')(config.elasticsearch)

// Message Queue
const KafkaProducer = require('../../messaging/kafka-producer')

const kafka_producer = new KafkaProducer(config.message_producer.options, config.message_producer.topic)

// Repositories
const PostRepository = require('../../repositories/post-repository')
const ReviewRepository = require('../../repositories/review-repository')
const SubReviewRepository = require('../../repositories/sub-review-repository')

const post_repository = new PostRepository(elasticsearch_engine)
const review_repository = new ReviewRepository(mysql_data_context)
const sub_review_repository = new SubReviewRepository(mysql_data_context)

// External service
const follow_service = require('../../services/external-services/follow-service')
const user_service = require('../../services/external-services/user-service')

// Services
const PostService = require('../../services/post-service')
const ReviewService = require('../../services/review-service')
const SubReviewService = require('../../services/sub-review-service')

const post_service = new PostService(post_repository, follow_service, user_service, kafka_producer)
const review_service = new ReviewService(review_repository, post_repository, kafka_producer)
const sub_review_service = new SubReviewService(sub_review_repository, review_repository, post_repository, kafka_producer)

// Controllers
const PostController = require('./controllers/post-controller')
const ReviewController = require('./controllers/review-controller')
const SubReviewController = require('./controllers/sub-review-controller')

const post_controller = new PostController(post_service)
const review_controller = new ReviewController(review_service)
const sub_review_controller = new SubReviewController(sub_review_service)

// Routes
require('./routes/post-route')(app, post_controller)
require('./routes/review-route')(app, review_controller)
require('./routes/sub-review-route')(app, sub_review_controller)

// Error Handling
app.use((err, req, res, next) => {
  if (err.type) {
    let { type, message, detail } = err
    let error = { type }
    if (message) Object.assign(error, { message })
    if (detail) Object.assign(error, { detail })

    switch (type) {
      case 'Bad Request':
        return res.status(400).send(error)
      case 'Unauthorized':
        return res.status(401).send(error)
      case 'Request Failed':
        return res.status(402).send(error)
      case 'Not Found':
        return res.status(404).send(error)
      case 'Duplicated':
        return res.status(409).send(error)
    }
  }

  return res.status(500).send({ error: 'Internal Server Error' })
})

// Start Server
const port = config.port
const env = process.env.NODE_ENV
app.listen(port, () => {
  console.info(`Environment: ${env}`)
  console.info(`Server is listening on port: ${port}`)
})

module.exports = app
