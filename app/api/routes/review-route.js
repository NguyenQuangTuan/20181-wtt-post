const tokent_middleware = require('../middlewares/tokent-middleware')
const review_middleware = require('../middlewares/review-middleware')

module.exports = (app, review_controller) => {
  app.get('/posts/:post_id/reviews',
    review_controller.find_all,
    (req, res) => {
      return res.status(200).send(res.reviews)
    }
  )

  app.post('/posts/:post_id/reviews',
    tokent_middleware.verify,
    review_middleware.validate_create,
    review_controller.create,
    (req, res) => {
      return res.status(200).send(res.created)
    }
  )

  app.put('/posts/:post_id/reviews/:review_id',
    tokent_middleware.verify,
    review_middleware.validate_update,
    review_controller.update,
    (req, res) => {
      return res.status(200).send(res.updated)
    }
  )

  app.delete('/posts/:post_id/reviews/:review_id',
    tokent_middleware.verify,
    review_controller.delete,
    (req, res) => {
      return res.status(200).send(res.deleted)
    }
  )
}