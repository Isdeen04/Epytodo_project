const express = require('express')
const app = express();
const sql = require('mysql2');
app.use(express.static('./public'));
app.use(express.json());

var db = sql.createConnection({
  host: 'localhost',
  user: 'jordan04',
  password: 'isdeen04',
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

module.exports = db;