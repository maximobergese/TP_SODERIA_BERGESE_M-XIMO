const pedidoModel = require('../models/pedidoModel');
const productoPedidoModel = require('../models/productoPedidoModel');

class PedidoController {
    // Crear un nuevo pedido
    crearPedido(req, res) {
        const { idCliente, fecha, productos } = req.body;

        if (!idCliente || !fecha || !productos || !productos.length) {
            return res.status(400).json({ error: 'Datos insuficientes para crear el pedido' });
        }

        // Calcular el precio final sumando el total de cada producto
        const precioFinal = productos.reduce((total, producto) => 
            total + producto.precioUnitario * producto.cantidad, 0
        );

        // Insertar el pedido en la base de datos
        pedidoModel.crearPedido(idCliente, fecha, precioFinal, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al crear el pedido en la base de datos' });
            }

            const idPedido = result.insertId;

            // Insertar cada producto asociado al pedido
            const productosPromises = productos.map(producto => {
                return new Promise((resolve, reject) => {
                    productoPedidoModel.agregarProducto(
                        idPedido, 
                        producto.nombreProducto, 
                        producto.precioUnitario, 
                        producto.cantidad, 
                        (err) => {
                            if (err) reject(`Error al agregar el producto ${producto.nombreProducto}`);
                            else resolve();
                        }
                    );
                });
            });

            // Esperar a que todos los productos sean insertados
            Promise.all(productosPromises)
                .then(() => res.status(201).json({ mensaje: 'Pedido y productos creados con éxito', idPedido }))
                .catch(error => res.status(500).json({ error: `Error al agregar productos al pedido: ${error}` }));
        });
    }

    // Obtener todos los pedidos
    obtenerPedidos(req, res) {
        pedidoModel.obtenerTodosLosPedidos((err, pedidos) => {
            if (err) {
                res.status(500).json({ error: 'Error al obtener los pedidos de la base de datos' });
            } else {
                res.status(200).json(pedidos);
            }
        });
    }

    // Obtener detalles de un pedido por ID
    obtenerDetallePedido(req, res) {
        const { idPedido } = req.params;

        pedidoModel.obtenerPedidoPorId(idPedido, (err, pedido) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener el pedido de la base de datos' });
            } 

            if (pedido.length === 0) {
                return res.status(404).json({ mensaje: 'Pedido no encontrado' });
            }

            productoPedidoModel.obtenerProductosPorPedido(idPedido, (err, productos) => {
                if (err) {
                    res.status(500).json({ error: 'Error al obtener productos del pedido' });
                } else {
                    res.status(200).json({ pedido: pedido[0], productos });
                }
            });
        });
    }
}

module.exports = new PedidoController();
