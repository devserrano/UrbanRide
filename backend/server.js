const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');

const vehiculosRoutes = require('./src/routes/vehiculos.routes');
const operadoresRoutes = require('./src/routes/operadores.routes');
const inspeccionesRoutes = require('./src/routes/inspecciones.routes');
const mantenimientosRoutes = require('./src/routes/mantenimientos.routes');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Verificación de conexión a la base de datos
pool.connect()
    .then((client) => {
        client.release();
        console.log('Base de datos PostgreSQL conectada');
    })
    .catch((err) => {
        console.error('Error de conexión:', err);
    });

// Ruta de salud
app.get('/api', (req, res) => {
    res.send('App corriendo correctamente en el servidor');
});

// Rutas por módulo
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/operadores', operadoresRoutes);
app.use('/api/inspecciones', inspeccionesRoutes);
app.use('/api/mantenimientos', mantenimientosRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
