const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const secret = 'bigjo';  // Remplacez cela par votre vraie clé secrète

function generateTokenForUser(user) {
  const payload = {
    userId: user.id,
    email: user.email
  };
  const options = {
    expiresIn: '24h'
  };
  return jwt.sign(payload, secret, options);
}

router.post('/register', (req, res) => {
  console.log(req.body);
  const { name, firstname, email, password } = req.body;

  if (!name || !firstname || !email || !password) {
    return res.status(400).json({ msg: 'Veuillez fournir tous les champs requis' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Erreur lors du hachage du mot de passe :', err);
      return res.status(500).json({ msg: 'Erreur lors du hachage du mot de passe' });
    }

    const query = 'INSERT INTO user (name, firstname, email, password) VALUES (?, ?, ?, ?)';

    db.query(query, [name, firstname, email, hash], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion des données :', err);
        return res.status(500).json({ msg: 'Erreur lors de l\'enregistrement des données : ' + err.message });
      }

      console.error('Inscription réussie');
      const user = { id: result.insertId, email: email };
      const token = generateTokenForUser(user);
      return res.status(200).json({token: token });
    });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ msg: 'Veuillez fournir un email et un mot de passe' });
  }

  const query = 'SELECT * FROM user WHERE email = ?';
  
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche de l\'utilisateur :', err);
      return res.status(500).json({ msg: 'Erreur lors de la recherche de l\'utilisateur' });
    }

    if (results.length === 0) {
      return res.status(401).json({ msg: 'Utilisateur non trouvé' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        console.error('Erreur lors de la comparaison des mots de passe :', err);
        return res.status(500).json({ msg: 'Erreur lors de la comparaison des mots de passe' });
      } else if (!match) {
        return res.status(401).json({ msg: 'Identifiants invalides' });
      } else {
        console.error('Connexion réussie');
        const token = generateTokenForUser(user);
        return res.status(200).json({token: token });
      }
    });
  });
});

module.exports = router;
