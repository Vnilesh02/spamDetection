const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Contact = require('./contact')(sequelize, DataTypes);
db.Spam = require('./spam')(sequelize, DataTypes);

db.User.hasMany(db.Contact, { as: 'Contacts' });
db.Contact.belongsTo(db.User, { foreignKey: 'user_id', as: 'User' });

db.User.hasMany(db.Spam, { as: 'SpamReports' });

module.exports = db;
