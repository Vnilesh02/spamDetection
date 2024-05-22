const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const db = require('../models');
const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  phoneNumber: Joi.string().pattern(/^\d{10}$/).required(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(255).required()
});

const loginSchema = Joi.object({
  phoneNumber: Joi.string().pattern(/^[0-9]+$/).min(10).required(),
  password: Joi.string().min(6).max(255).required()
});

router.post('/register', async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { name, phoneNumber, email, password } = req.body;
    const existingUser = await db.User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await db.User.create({ name, phoneNumber, email, password: hashedPassword });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).send({ user, token });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { phoneNumber, password } = req.body;
    const user = await db.User.findOne({ where: { phoneNumber } });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ user, token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
