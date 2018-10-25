const Sequelize = require('sequelize')

const DataContext = (config) => {
  const sequelize = new Sequelize(config.database, config.username, config.password, config)

  const Post = sequelize.import('./mysql-models/post')

  return { Post, sequelize }
}

module.exports = DataContext