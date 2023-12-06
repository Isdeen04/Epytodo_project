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

router.get('/todos/:id', async (req, res) => {
  const todoId = req.params.id;
  try {
    const todo = await getTodoById(todoId);
    if (!todo) {
      return res.status(404).json({ msg: 'Not found' });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.post('/todos', async (req, res) => {
  const { title, description, due_time, status } = req.body;
  try {
    const newTodo = await createTodo(title, description, due_time, status, req.user.id);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.put('/todos/:id', async (req, res) => {
  const todoId = req.params.id;
  const { title, description, due_time, status } = req.body;
  try {
    const updatedTodo = await updateTodo(todoId, title, description, due_time, status);
    if (!updatedTodo) {
      return res.status(404).json({ msg: 'Not found' });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

router.delete('/todos/:id', async (req, res) => {
  const todoId = req.params.id;
  try {
    const deletedTodo = await deleteTodo(todoId);
    if (!deletedTodo) {
      return res.status(404).json({ msg: 'Not found' });
    }
    res.status(200).json({ msg: `Successfully deleted record number: ${todoId}` });
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

module.exports = router;
