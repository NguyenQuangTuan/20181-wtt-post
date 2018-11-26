const Sequelize = require('sequelize')

const DataContext = (config) => {
  const sequelize = new Sequelize(config.database, config.username, config.password, config)

  return { sequelize }
}

module.exports = DataContext