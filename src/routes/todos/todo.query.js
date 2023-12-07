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
