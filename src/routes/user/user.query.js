const express = require("express")
const db = require("../../config/db")
const user = require("../../config/db")
const my_router = express.Router()


my_router.get('/users', (req, res) => {
    db.query('SELECT id, name, firstname, email, password, created_at FROM user', (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des informations utilisateur :', error);
            return res.status(500).json({ error: 'Erreur serveur lors de la récupération des informations utilisateur' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Aucun utilisateur trouvé' });
        }
        const users = results;
        console.log('Informations de tous les utilisateurs :', users);
        return res.status(200).json({ users });
    });
});

my_router.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ error: 'ID incorrect' });
    }
    db.query('SELECT id, name, firstname, email, password FROM user WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des informations utilisateur :', error);
            return res.status(500).json({ error: 'Erreur serveur lors de la récupération des informations utilisateur' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        const user = results[0];
        console.log('Informations de l\'utilisateur :', user);
        return res.status(200).json({ user });
    });
});

my_router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { email, password, firstname, name } = req.body;
    if (!email || !password || !firstname || !name) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour la mise à jour' });
    }
    db.query('UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?', 
        [email, password, firstname, name, userId],
        (error, results) => {
            if (error) {
                console.error('Erreur lors de la mise à jour des informations utilisateur :', error);
                return res.status(500).json({ error: 'Erreur serveur lors de la mise à jour des informations utilisateur' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            db.query('SELECT * FROM user WHERE id = ?', [userId], (err, updatedUser) => {
                if (err) {
                    console.error('Erreur lors de la récupération des informations utilisateur mises à jour :', err);
                    return res.status(500).json({ error: 'Erreur serveur lors de la récupération des informations utilisateur mises à jour' });
                }
                const { id, email, password, created_at, firstname, name } = updatedUser[0];
                const formattedResponse = {
                    id,
                    email,
                    password,
                    created_at,
                    firstname,
                    name
                };
                return res.status(200).json(formattedResponse);
            });
        }
    );
});


my_router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM user WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
            return res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'utilisateur' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        return res.status(200).json({ msg: 'Successfully deleted record number: ${userId}' });
    });
});

my_router.get('/user/todos', (req, res) => {
    db.query('SELECT * FROM todo', (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des tâches :', error);
            return res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Aucune tâche trouvée' });
        }

        const todos = results;
        console.log('Informations de toutes les tâches :', todos);
        return res.status(200).json({ todos });
    });
});


module.exports = my_router;