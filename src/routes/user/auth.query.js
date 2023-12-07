const db = require('../config/db');

async function getUserByEmail(email) {
  const query = 'SELECT * FROM user WHERE email = ?';
  const [users] = await db.query(query, [email]);
  return users[0];
}
