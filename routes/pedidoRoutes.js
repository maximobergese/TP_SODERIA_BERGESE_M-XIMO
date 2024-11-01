const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
/* const productoController = require('../controllers/productoController');  */

// Rutas para pedidos
router.post('/pedidos', pedidoController.crearPedido); // Crear un nuevo pedido
router.get('/pedidos', pedidoController.obtenerPedidos); // Obtener todos los pedidos
router.get('/pedidos/:idPedido', pedidoController.obtenerDetallePedido); // Obtener detalles de un pedido por ID

module.exports = router;
