const express = require('express');
const Joi = require('joi');
const auth = require('../middleware/auth');
const db = require('../models');
const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  phoneNumber: Joi.string().pattern(/^[0-9]+$/).required()
});

router.post('/contacts', auth, async (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { name, phoneNumber } = req.body;
    const contact = await db.Contact.create({ name, phoneNumber, user_id: req.user.id });
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

router.get('/contacts', auth, async (req, res, next) => {
  try {
    const contacts = await db.Contact.findAll({ where: { user_id: req.user.id } });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
