'use strict';

module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamp: true,
    tableName:  'Contact'
  });

  Contact.associate = function(models) {
    Contact.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
  };

  return Contact;
};
