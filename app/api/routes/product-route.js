/**
 * Tầng routes:
 * - Tầng này định nghĩa ra các api và chèn các middleware theo thứ tự
 */

const tokent_middleware = require('../middlewares/tokent-middleware')
const role_middleware = require('../middlewares/role-middleware')
const post_middleware = require('../middlewares/post-middleware')

module.exports = (app, post_controller) => {
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
    role_middleware.check_user,
    tokent_middleware.check_authen_valid,
    post_controller.creare,
    (req, res) => {
      return res.status(200).send(res.created)
    }
  )

  app.put('/posts/:post_id',
    tokent_middleware.verify,
    role_middleware.check_user,
    tokent_middleware.check_authen_valid,
    post_controller.update,
    (req, res) => {
      return res.status(200).send(res.updated)
    }
  )

  app.delete('/posts/:post_id',
    tokent_middleware.verify,
    role_middleware.check_user,
    tokent_middleware.check_authen_valid,
    post_controller.detele,
    (req, res) => {
      return res.status(200).send(res.deleted)
    }
  )
}