const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const sql = require('mysql2');
const bcrypt = require('bcrypt');

app.use(express.static('public'));
app.use(express.json());

var db = sql.createConnection({
  host: 'localhost',
  user: 'djordan',
  password: 'jordan',
  database: 'epytodo'
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données');
    return;
  } else {
    console.log('Connexion réussie à la base de données');
  }
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const selectQuery = 'SELECT * FROM user WHERE username = ? AND password = ?';
  db.query(selectQuery, [username, password], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification des informations de connexion dans la base de données:', err);
      res.json({ success: false });
    } else {
      if (results.length > 0) {
        console.log('Connexion réussie');
        res.json({ success: true });
      } else {
        console.log('Échec de la connexion, les informations ne correspondent pas');
        res.json({ success: false });
      }
    }
  });
});

app.post('/signup', async (req, res) => {
  const { newUsername, firstname, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = 'INSERT INTO user (username, firstname, email, password) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [newUsername, firstname, email, hashedPassword], (err, results) => {
      if (err) {
        console.error('Erreur lors de l\'insertion dans la base de données:', err);
        res.json({ success: false });
      } else {
        console.log('Inscription réussie');
        res.json({ success: true });
      }
    });
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe:', error);
    res.json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
});
