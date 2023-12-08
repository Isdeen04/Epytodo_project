const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const { isAuthenticated } = require('../../middleware/auth');

router.route('/todos').post();
router.route('/todos/:id').get();
router.route('/todos').get();
router.route('/todos/:id').put();
router.route('/todos/:id').delete();

module.exports = router;
