'use strict';

module.exports = (sequelize, DataTypes) => {
  const Spam = sequelize.define('Spam', {
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reportCount: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamp: true,
    tableName:  'Spam'
  });

  Spam.associate = function(models) {
    Spam.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
  };

  return Spam;
};
