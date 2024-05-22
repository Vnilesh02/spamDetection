'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  
   User.associate = models => {
    User.hasMany(models.Spam, {
      foreignKey: 'user_id',
      as: 'SpamReports'
    });
    User.hasMany(models.Contact, { as: 'Contacts' });
  };
  
  return User;
};
