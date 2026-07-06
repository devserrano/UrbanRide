const { Router } = require('express');
const controller = require('../controllers/mantenimientos.controller');

const router = Router();

router.get('/', controller.obtenerMantenimientos);
router.post('/', controller.crearMantenimiento);
router.put('/:id/finalizar', controller.finalizarMantenimiento);
router.put('/:id', controller.actualizarMantenimiento);

module.exports = router;
