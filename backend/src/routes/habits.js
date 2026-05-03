const express = require('express');
const { listar, crear, actualizar, eliminar } = require('../controllers/habitController');
const { proteger } = require('../middleware/auth');

const router = express.Router();

router.use(proteger);

router.get('/', listar);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

module.exports = router;
