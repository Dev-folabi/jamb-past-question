const express = require('express');
const { registerUser, login, getUserProfile } = require('../api/controller/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', registerUser);
router.post('/login', login);
router.get('/:id', auth, getUserProfile)

module.exports = router;
