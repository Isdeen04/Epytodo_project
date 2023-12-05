const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided, access denied' });
    }
