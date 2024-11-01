const express = require('express');
const router = express.Router();
const clientesControllers = require('../controllers/clientesControllers');

// Rutas para clientes
router.get('/', clientesControllers.consultar); // Consultar todos los clientes
router.get('/:id', clientesControllers.consultarDetalle); // Consultar cliente por ID
router.post('/', clientesControllers.ingresar); // Crear nuevo cliente
router.put('/:id', clientesControllers.actualizar); // Actualizar cliente
router.delete('/:id', clientesControllers.borrar); // Eliminar cliente

module.exports = router;
