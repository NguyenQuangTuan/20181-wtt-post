const tokent_middleware = require('../middlewares/tokent-middleware')
const sub_review_middleware = require('../middlewares/review-middleware')

module.exports = (app, sub_review_controller) => {
  app.get('/posts/:post_id/reviews/:review_id/subreviews',
  sub_review_controller.find_all,
    (req, res) => {
      return res.status(200).send(res.sub_reviews)
    }
  )

  app.post('/posts/:post_id/reviews/:review_id/subreviews',
    tokent_middleware.verify,
    sub_review_middleware.validate_create,
    sub_review_controller.create,
    (req, res) => {
      return res.status(200).send(res.created)
    }
  )

  app.put('/posts/:post_id/reviews/:review_id/subreviews/:sub_review_id',
    tokent_middleware.verify,
    sub_review_middleware.validate_update,
    sub_review_controller.update,
    (req, res) => {
      return res.status(200).send(res.updated)
    }
  )

  app.delete('/posts/:post_id/reviews/:review_id/subreviews/:sub_review_id',
    tokent_middleware.verify,
    sub_review_controller.delete,
    (req, res) => {
      return res.status(200).send(res.deleted)
    }
  )
}