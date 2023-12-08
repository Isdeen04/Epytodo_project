const express = require("express")
const db = require("../../config/db")
const user = require("../../config/db")
const rout = express.Router()

rout.post('/todos', (req, res) => {
    const { title, description, due_time, user_id, status } = req.body;
    if (!title || !description || !due_time || !user_id || !status) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour créer une tâche' });
    }
    db.query(
        'INSERT INTO todo (title, description, created_at, due_time, user_id, status) VALUES (?, ?, NOW(), ?, ?, ?)',
        [title, description, due_time, user_id, status],
        (error, results) => {
            if (error) {
                console.error('Erreur lors de la création de la tâche :', error);
                return res.status(500).json({ error: 'Erreur serveur lors de la création de la tâche' });
            }
            const newTodoId = results.insertId;
            db.query('SELECT * FROM todo WHERE id = ?', [newTodoId], (err, createdTodo) => {
                if (err) {
                    console.error('Erreur lors de la récupération de la tâche créée :', err);
                    return res.status(500).json({ error: 'Erreur serveur lors de la récupération de la tâche créée' });
                }
                return res.status(200).json({ todo: createdTodo[0] });
            });
        }
    );
});

rout.get('/todos/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM todo WHERE user_id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des tâches de l\'utilisateur :', error);
            return res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches de l\'utilisateur' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Aucune tâche trouvée pour cet utilisateur' });
        }
        console.log('Informations des tâches de l\'utilisateur :', results);
        return res.status(200).json({ todos: results });
    });
});

rout.get('/todos', (req, res) => {
    db.query('SELECT * FROM todo', (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des tâches :', error);
            return res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Aucune tâche trouvée' });
        }
        console.log('Informations des tâches :', results);
        return res.status(200).json({ todos: results });
    });
});

rout.put('/todos/:id', (req, res) => {
    const userId = req.params.id;
    const { title, description, due_time, status } = req.body;

    if (!title || !description || !due_time || !status) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour mettre à jour la tâche' });
    }

    db.query(
        'UPDATE todo SET title = ?, description = ?, due_time = ?, status = ? WHERE user_id = ?',
        [title, description, due_time, status, userId],
        (error, results) => {
            if (error) {
                console.error('Erreur lors de la mise à jour de la tâche :', error);
                return res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la tâche' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Aucune tâche trouvée pour cet utilisateur ou mise à jour non effectuée' });
            }
            return res.status(200).json({ msg: `Tâches mises à jour avec succès pour l'utilisateur ID ${userId}`});
        }
    );
});

rout.delete('/todos/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM todo WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la suppression de la tâche :', error);
            return res.status(500).json({ error: 'Erreur serveur lors de la suppression de la tâche' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Tâche non trouvée' });
        }
        return res.status(200).json({ msg: `Tâche avec l'ID ${userId} supprimée avec succès` });
    });
});


module.exports = rout;