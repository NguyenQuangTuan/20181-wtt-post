module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Review', {
    review_id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    post_id: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
      underscored: true,
    })
}