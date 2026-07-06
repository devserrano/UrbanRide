const { Router } = require('express');
const controller = require('../controllers/operadores.controller');

const router = Router();

router.get('/', controller.obtenerOperadores);
router.post('/', controller.crearOperador);
router.put('/:id', controller.actualizarOperador);

module.exports = router;
