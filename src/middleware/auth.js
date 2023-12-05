const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided, access denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
