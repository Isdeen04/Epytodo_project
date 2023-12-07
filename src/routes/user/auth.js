const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { createUser, getUserByEmail, updateUser } = require('../user/user.query');

router.post('/register', async (req, res) => {
  const { email, password, name, firstname } = req.body;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ msg: 'Account already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, hashedPassword, name, firstname);

    const token = jwt.sign({ id: newUser.id }, process.env.SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});
