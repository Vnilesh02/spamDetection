const express = require('express');
const auth = require('../middleware/auth');
const db = require('../models');
const router = express.Router();
const Joi = require('joi');

const spamSchema = Joi.object({
  phoneNumber: Joi.string().pattern(/^[0-9]+$/).required()
});

router.post('/spam', auth, async (req, res) => {
  const { error } = spamSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  try {
    const { phoneNumber } = req.body;
    const user_id = req.user.id;

    const isSpam = await db.Spam.findOne({
      where: {phoneNumber},
    });

    if (!isSpam) {
      await db.Spam.create({ reportSpam: 1, user_id });
    } else {
      await db.Spam.update(
        { reportCount: isSpam.dataValues.reportCount + 1, user_id },
        { where: { phoneNumber } }
      );
    }



    res.status(201).send(isSpam);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
