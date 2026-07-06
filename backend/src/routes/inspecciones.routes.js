const { Router } = require('express');
const controller = require('../controllers/inspecciones.controller');

const router = Router();

router.get('/', controller.obtenerInspecciones);
router.post('/', controller.crearInspeccion);
router.put('/:id', controller.actualizarInspeccion);

module.exports = router;
