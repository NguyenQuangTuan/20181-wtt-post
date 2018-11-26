/**
 * Tầng routes:
 * - Tầng này định nghĩa ra các api và chèn các middleware theo thứ tự
 */

const tokent_middleware = require('../middlewares/tokent-middleware')
const post_middleware = require('../middlewares/post-middleware')

module.exports = (app, post_controller) => {
  app.get('/posts/autocomplete',
    post_controller.autocomplete,
    (req, res) => {
      return res.status(200).send(res.posts)
    }
  )

  app.get('/posts',
    post_controller.find_all,
    (req, res) => {
      return res.status(200).send(res.posts)
    }
  )

  app.get('/posts/:post_id',
    post_controller.find_one,
    (req, res) => {
      return res.status(200).send(res.post)
    }
  )

  app.post('/posts',
    tokent_middleware.verify,
    post_middleware.validate_create,
    post_controller.create,
    (req, res) => {
      return res.status(200).send(res.created)
    }
  )

  app.put('/posts/:post_id',
    tokent_middleware.verify,
    post_middleware.validate_update,
    post_controller.update,
    (req, res) => {
      return res.status(200).send(res.updated)
    }
  )

  app.delete('/posts/:post_id',
    tokent_middleware.verify,
    post_controller.delete,
    (req, res) => {
      return res.status(200).send(res.deleted)
    }
  )
}