const db = require('../config/db');

async function getAllTodos(userId) {
  const query = 'SELECT * FROM todo WHERE user_id = ?';
  const [todos] = await db.query(query, [userId]);
  return todos;
}

async function getTodoById(todoId) {
  const query = 'SELECT * FROM todo WHERE id = ?';
  const [todo] = await db.query(query, [todoId]);
  return todo[0];
}

async function createTodo(title, description, due_time, status, userId) {
  const query = 'INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)';
  const [result] = await db.query(query, [title, description, due_time, status, userId]);
  return { id: result.insertId, title, description, due_time, status, user_id: userId };
}

async function updateTodo(todoId, title, description, due_time, status) {
  const query = 'UPDATE todo SET title = ?, description = ?, due_time = ?, status = ? WHERE id = ?';
  const [result] = await db.query(query, [title, description, due_time, status, todoId]);
  if (result.affectedRows > 0) {
    return { id: todoId, title, description, due_time, status };
  }
  return null;
}
