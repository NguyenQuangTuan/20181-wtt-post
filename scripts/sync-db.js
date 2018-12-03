const config = require('../config/config')
const mysql_data_context = require('../repositories/mysql-context')(config.mysql)
mysql_data_context.sequelize.sync()
