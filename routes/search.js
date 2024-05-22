const express = require('express');
const Joi = require('joi');
const auth = require('../middleware/auth');
const db = require('../models');
const router = express.Router();

const nameSchema = Joi.object({
  name: Joi.string().min(1).max(255).required()
});

const phoneSchema = Joi.object({
  phoneNumber: Joi.string().pattern(/^[0-9]+$/).required()
});

router.get('/search/name/:name', auth, async (req, res, next) => {
  const { error } = nameSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { name } = req.params;
    const users = await db.User.findAll({
      where: {
        name: {
          [db.Sequelize.Op.like]: `${name}%`
        }
      },
      attributes: ['id', 'name', 'phoneNumber']
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/search/phone/:phoneNumber', auth, async (req, res, next) => {
  const { error } = phoneSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { phoneNumber } = req.params;
    const user = await db.User.findOne({
      where: { phoneNumber },
      include: [
        {
          model: db.Spam,
          as: 'SpamReports',
          attributes: ['phoneNumber', 'reportCount'],
          required: false
        }
      ]
    });

    if (user) {
      return res.json([user]);
    }

    const contacts = await db.Contact.findAll({
      where: { phoneNumber },
      attributes: ['id', 'name', 'phoneNumber', 'user_id']
    });

    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
