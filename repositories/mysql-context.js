const Sequelize = require('sequelize')

const DataContext = (config) => {
  const sequelize = new Sequelize(config.database, config.username, config.password, config)

  const Review = sequelize.import('./mysql-models/review')
  const SubReview = sequelize.import('./mysql-models/sub-review')
  const Tag = sequelize.import('./mysql-models/tag')

  return { sequelize, Review, SubReview, Tag }
}

module.exports = DataContext