module.exports = (app, tag_controller) => {
  app.get('/tags',
    tag_controller.find_all,
    (req, res) => {
      return res.status(200).send(res.tags)
    }
  )
}