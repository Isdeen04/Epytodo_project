const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { createUser, getUserByEmail, comparePasswords } = require('../user/user.query');
const { verifyToken } = require('../middleware/auth');

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.get('/user', verifyToken, async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.get('/users/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.put('/users/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;
  const { email, password, name, firstname } = req.body;
  try {
    const updatedUser = await updateUserById(userId, email, password, name, firstname);
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.delete('/users/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await deleteUserById(userId);
    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ msg: `Successfully deleted user with ID: ${userId}` });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.get('/todos', verifyToken, async (req, res) => {
  try {
    const todos = await getAllTodosForUser(req.user.id);
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.get('/todos/:id', verifyToken, async (req, res) => {
  const todoId = req.params.id;
  try {
    const todo = await getTodoByIdForUser(todoId, req.user.id);
    if (!todo) {
      return res.status(404).json({ msg: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.post('/todos', verifyToken, async (req, res) => {
  const { title, description, due_time, status } = req.body;
  try {
    const newTodo = await createTodoForUser(title, description, due_time, status, req.user.id);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});
