const { Router } = require('express');
const controller = require('../controllers/vehiculos.controller');

const router = Router();

router.get('/', controller.obtenerVehiculos);
router.post('/', controller.crearVehiculo);
router.put('/:id', controller.actualizarVehiculo);
router.delete('/:id', controller.eliminarVehiculo);

module.exports = router;
