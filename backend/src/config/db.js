const { Pool } = require('pg');

// Configuración vía variables de entorno con valores por defecto
// para desarrollo local. En producción se definen en el entorno
// y las credenciales nunca quedan en el código.
const pool = new Pool({
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'bicitaxi_db',
    password: process.env.DB_PASSWORD || 'admin123',
    port: Number(process.env.DB_PORT) || 5432
});

module.exports = pool;
