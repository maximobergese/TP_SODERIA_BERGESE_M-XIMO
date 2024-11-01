// Seleccionar el formulario y la lista de pedidos
const pedidoForm = document.getElementById('pedidoForm');
const pedidoList = document.getElementById('pedidoList');

// Evento de carga de la página
document.addEventListener("DOMContentLoaded", function () {
    cargarClientes(); // Cargar clientes en el select
    cargarProductos(); // Cargar productos en el select
    cargarPedidos(); // Cargar la lista de pedidos

    // Evento para enviar el formulario
    pedidoForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el envío del formulario
        crearPedido(); // Crear el pedido y productos asociados
    });
});

// Función para cargar los clientes en el select
function cargarClientes() {
    fetch('http://localhost:6500/clientes')
        .then(response => response.json())
        .then(clientes => {
            const clienteSelect = document.getElementById("Cliente");
            clienteSelect.innerHTML = "";
            clientes.forEach(cliente => {
                const option = document.createElement("option");
                option.value = cliente.idCliente; // Usar ID como valor
                option.textContent = `${cliente.idCliente} - ${cliente.nombre}`; // Mostrar ID y nombre
                clienteSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar clientes:", error));
}

// Función para cargar los productos en el select
function cargarProductos() {
    fetch('http://localhost:6500/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error('La respuesta de la red no fue correcta');
            }
            return response.json();
        })
        .then(productos => {
            const productoSelect = document.querySelector("#Producto");
            productoSelect.innerHTML = ''; // Limpiar el selector
            productos.forEach(producto => {
                const option = document.createElement("option");
                option.value = producto.idProducto; // Usar ID del producto
                option.textContent = `${producto.descripcion} - $${producto.precio}`; // Mostrar descripción y precio
                productoSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar productos:", error));
}

// Función para crear el pedido y los productos asociados
function crearPedido() {
    const idCliente = document.getElementById("Cliente").value;
    const idProducto = document.getElementById("Producto").value;
    const cantidad = parseInt(document.getElementById("Cantidad").value);
    const precioUnitario = parseFloat(document.getElementById("monto").value);
    const fecha = document.getElementById("fecha").value;

    // Validar campos requeridos
    if (!idCliente || !idProducto || isNaN(cantidad) || isNaN(precioUnitario) || !fecha) {
        alert("Por favor, complete todos los campos correctamente.");
        return;
    }

    const precioFinal = cantidad * precioUnitario;

    // Crear el pedido
    fetch('http://localhost:6500/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idCliente: idCliente, fecha: fecha, precioFinal: precioFinal })
    })
    .then(response => response.json())
    .then(pedido => {
        const idPedido = pedido.idPedido; // Obtener ID del pedido creado

        // Crear el producto asociado al pedido en productopedido
        return fetch('http://localhost:6500/productospedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idPedido: idPedido, idProducto: idProducto, precioUnitario: precioUnitario, cantidad: cantidad })
        });
    })
    .then(() => {
        alert("Pedido y productos creados con éxito.");
        cargarPedidos(); // Actualizar la lista de pedidos
        pedidoForm.reset(); // Limpiar formulario
    })
    .catch(error => console.error("Error al crear el pedido o productos:", error));
}

// Función para cargar y listar los pedidos en el frontend
function cargarPedidos() {
    fetch('http://localhost:6500/pedidos')
        .then(response => response.json())
        .then(pedidos => {
            pedidoList.innerHTML = ""; // Limpiar la lista
            pedidos.forEach(pedido => {
                const nuevoPedido = document.createElement('li');
                nuevoPedido.textContent = `Cliente: ${pedido.clienteNombre} | Producto: ${pedido.productoNombre} | Cantidad: ${pedido.cantidad} | Monto: $${pedido.precioUnitario} | Fecha: ${pedido.fecha}`;
                pedidoList.appendChild(nuevoPedido);
            });
        })
        .catch(error => console.error("Error al cargar pedidos:", error));
}
