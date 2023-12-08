const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const { isAuthenticated } = require('../../middleware/auth');

router.route('/users').get();
router.route('/users/user_:id').get();
router.route('/users/:id').put();
router.route('/users/:id').delete();
router.route('/user/todos').get();

module.exports = router;
