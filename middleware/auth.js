const jwt = require('jsonwebtoken');
const db = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).send({ error: 'Access denied. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: 'Access denied. Invalid token.' });
  }
};

module.exports = auth;
