const express = require('express');
const { register, login, perfil } = require('../controllers/authController');
const { proteger } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/perfil', proteger, perfil);

module.exports = router;
