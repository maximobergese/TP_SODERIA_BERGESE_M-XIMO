
document.addEventListener("DOMContentLoaded", function () {
    cargarClientes(); // Cargar los clientes cuando la página cargue

    const clienteForm = document.querySelector("#clienteForm");
    const guardarBtn = document.querySelector("#guardarBtn");
    const modificarBtn = document.querySelector("#modificarBtn");

    clienteForm.addEventListener("submit", function (event) {
        event.preventDefault();
        agregarCliente(); // Guardar nuevo cliente
    });

    // Botón de modificar cliente
    modificarBtn.addEventListener("click", function () {
        const idCliente = clienteForm.dataset.idCliente;
        if (idCliente) {
            actualizarCliente(idCliente);
        }
    });
});

// Función para cargar clientes y mostrarlos en la tabla +
function cargarClientes() {
    fetch('http://localhost:6500/clientes')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#table_usuario");
            tableBody.innerHTML = '';
            data.forEach(cliente => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${cliente.idCliente}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.dni}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.direccion}</td>
                    <td>${cliente.zona}</td>
                    <td>${cliente.localidad}</td>
                    <td>
                        <button onclick="consultarCliente(${cliente.idCliente})">Consultar</button>
                        <button onclick="prepararModificacion(${cliente.idCliente})">Modificar</button>
                        <button onclick="eliminarCliente(${cliente.idCliente})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error al cargar los clientes:", error);
        });
}

// Función para consultar datos de un cliente (solo lectura) +
function consultarCliente(idCliente) {
    fetch(`http://localhost:6500/clientes/${idCliente}`)
        .then(response => response.json())
        .then(data => {
            llenarFormulario(data);
            deshabilitarFormulario(true); // Pone al form en modo solo lectura
            mostrarBotones(false); // Ocultar botón de modificar cliente
        })
        .catch(error => {
            console.error("Error al consultar el cliente:", error);
        });
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
}

// Función para preparar el formulario para modificar un cliente +
function prepararModificacion(idCliente) {
    fetch(`http://localhost:6500/clientes/${idCliente}`)
        .then(response => response.json())
        .then(data => {
            llenarFormulario(data); //Función para llenar el formulario
            deshabilitarFormulario(false); // Habilitar campos para edición
            document.querySelector("#clienteForm").dataset.idCliente = idCliente;
            mostrarBotones(true); // Permite mostrar el botón de modificar
        })
        .catch(error => {
            console.error("Error al preparar la modificación del cliente:", error);
        });
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
}

// Función para llenar el formulario con los datos del cliente +
function llenarFormulario(cliente) {
    document.querySelector("#nombre").value = cliente.nombre;
    document.querySelector("#dni").value = cliente.dni;
    document.querySelector("#telefono").value = cliente.telefono;
    document.querySelector("#direccion").value = cliente.direccion;
    document.querySelector("#zona").value = cliente.zona;
    document.querySelector("#localidad").value = cliente.localidad;
}

// Función para deshabilitar el formulario +
function deshabilitarFormulario(desactivar) {
    document.querySelector("#nombre").disabled = desactivar;
    document.querySelector("#dni").disabled = desactivar;
    document.querySelector("#telefono").disabled = desactivar;
    document.querySelector("#direccion").disabled = desactivar;
    document.querySelector("#zona").disabled = desactivar;
    document.querySelector("#localidad").disabled = desactivar;
}

// Función para mostrar u ocultar los botones de acción +
function mostrarBotones(modoModificacion) {
    if (modoModificacion) {
        document.querySelector("#guardarBtn").style.display = "none";
        document.querySelector("#modificarBtn").style.display = "inline-block";
    } else {
        document.querySelector("#guardarBtn").style.display = "inline-block";
        document.querySelector("#modificarBtn").style.display = "none";
    }
}

// Función para agregar un cliente nuevo +
function agregarCliente() {
    const data = {
        nombre: document.querySelector("#nombre").value,
        dni: document.querySelector("#dni").value,
        telefono: document.querySelector("#telefono").value,
        direccion: document.querySelector("#direccion").value,
        zona: document.querySelector("#zona").value,
        localidad: document.querySelector("#localidad").value
    };
    fetch('http://localhost:6500/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        Swal.fire({ //Alerta de que la carga fue exitosa (SweetAlert)
            title: 'Cliente agregado con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: "#213442"});
        cargarClientes(); // Recargar la lista de clientes
        limpiarFormulario(); //Limpia el formulario para poder cargar más clientes
    })
    .catch(error => {
        console.error("Error al agregar el cliente:", error);
    });
}

// Función para actualizar un cliente +
function actualizarCliente(idCliente) {
    const data = {
        nombre: document.querySelector("#nombre").value,
        dni: document.querySelector("#dni").value,
        telefono: document.querySelector("#telefono").value,
        direccion: document.querySelector("#direccion").value,
        zona: document.querySelector("#zona").value,
        localidad: document.querySelector("#localidad").value
    };
    fetch(`http://localhost:6500/clientes/${idCliente}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) { //Alerta de confirmación
            Swal.fire({
                title: 'Cliente actualizado con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: "#213442"
            });
            cargarClientes(); // Recargar la lista de clientes
            limpiarFormulario(); //Limpiar el formulario
            mostrarBotones(false); //Oculta el botón de modificar
        } else {
            Swal.fire({ //Alerta de error
                title: 'Error',
                text: 'Error al actualizar el cliente.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: "#213442"
            });
        }
    })
    .catch(error => {
        console.error("Error al actualizar el cliente:", error);
    });
}

// Función para eliminar un cliente +
function eliminarCliente(idCliente) {
    Swal.fire({ // Alerta de SweetAlert con solicitud de confirmación
        title: '¿Estás seguro?',
        text: "No podrás revertir esto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:6500/clientes/${idCliente}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire( // Alerta de cliente eliminado
                        'Eliminado!',
                        'El cliente ha sido eliminado.',
                        'success'
                    );
                    cargarClientes(); // Recargar la lista de clientes
                } else {
                    Swal.fire( // Alerta de error
                        'Error',
                        'No se pudo eliminar el cliente.',
                        'error'
                    );
                }
            })
            .catch(error => {
                console.error("Error al eliminar el cliente:", error);
            });
        }
    });
    
}

// Función para limpiar el formulario y restablecer el estado +
function limpiarFormulario() {
    document.querySelector("#nombre").value = '';
    document.querySelector("#dni").value = '';
    document.querySelector("#telefono").value = '';
    document.querySelector("#direccion").value = '';
    document.querySelector("#zona").value = '';
    document.querySelector("#localidad").value = '';
    document.querySelector("#clienteForm").dataset.idCliente = ''; // Limpiar ID del formulario
    mostrarBotones(false); // Mostrar botón para guardar un nuevo cliente
}

document.addEventListener("DOMContentLoaded", function () {
    cargarClientes(); // Cargar los clientes cuando la página cargue

    const searchInput = document.querySelector("#searchInput");
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        buscarClientes(query);
    });
});

// Función para buscar clientes por nombre, DNI, ID, localidad o dirección
function buscarClientes(query) {
    const rows = document.querySelectorAll("#table_usuario tr");
    rows.forEach(row => {
        const id = row.cells[0].textContent.toLowerCase();
        const nombre = row.cells[1].textContent.toLowerCase();
        const dni = row.cells[2].textContent.toLowerCase();
        const telefono = row.cells[3].textContent.toLowerCase();
        const direccion = row.cells[4].textContent.toLowerCase();
        const zona = row.cells[5].textContent.toLowerCase();
        const localidad = row.cells[6].textContent.toLowerCase();

        // Si la búsqueda coincide con alguna de las celdas, mostrar la fila
        if (id.includes(query) || nombre.includes(query) || dni.includes(query) || direccion.includes(query)|| zona.includes(query) || localidad.includes(query)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
