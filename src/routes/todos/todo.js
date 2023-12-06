const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} = require('./todos.query');

router.use(verifyToken);

router.get('/todos', async (req, res) => {
  try {
      const todos = await getAllTodos(req.user.id);
      res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});
