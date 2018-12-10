module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Tag', {
    tag_id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    tag: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    }
  }, {
      underscored: true,
      paranoid: true
    })
}