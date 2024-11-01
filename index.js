const express = require('express');
const cors = require('cors');
const app = express();

// Importar las rutas de cada entidad
const clientesRoutes = require('./routes/clientesRoutes');
const pedidosRoutes = require('./routes/pedidoRoutes');


app.use(express.json());
app.use(cors());

// Definir las rutas
app.use("/clientes", clientesRoutes);
app.use("/pedidos", pedidosRoutes);


// Iniciar servidor
app.listen(6500, () => {
    console.log('Servidor activo en http://localhost:6500');
});
