const db = require('../config/db');

async function getUserByEmail(email) {
  const query = 'SELECT * FROM user WHERE email = ?';
  const [users] = await db.query(query, [email]);
  return users[0];
}

async function createUser(email, password, name, firstname) {
  const query = 'INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)';
  const [result] = await db.query(query, [email, password, name, firstname]);
  return { id: result.insertId, email, password, name, firstname };
}

async function updateUser(id, email, password, name, firstname) {
  const query = 'UPDATE user SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?';
  const [result] = await db.query(query, [email, password, name, firstname, id]);
  if (result.affectedRows > 0) {
    return { id, email, password, name, firstname };
  }
  return null;
}

module.exports = {
  getUserByEmail,
  createUser,
  updateUser
};
