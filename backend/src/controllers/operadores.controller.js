const pool = require('../config/db');

// GET /api/operadores
async function obtenerOperadores(req, res) {
    try {
        const resultado = await pool.query(
            `
            SELECT
                operadores.id,
                operadores.nombre,
                operadores.telefono,
                operadores.estado,
                operadores.foto,
                vehiculos.unidad,
                vehiculos.estado AS estado_vehiculo
            FROM operadores
            LEFT JOIN vehiculos
                ON vehiculos.operador_id = operadores.id
            ORDER BY operadores.id ASC
            `
        );

        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener operadores' });
    }
}

// POST /api/operadores
async function crearOperador(req, res) {
    try {
        const { nombre, telefono, foto, estado } = req.body;

        const resultado = await pool.query(
            `
            INSERT INTO operadores (nombre, telefono, foto, estado)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [nombre, telefono, foto, estado]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al agregar operador' });
    }
}

// PUT /api/operadores/:id
async function actualizarOperador(req, res) {
    try {
        const { id } = req.params;
        const { nombre, telefono, foto, estado } = req.body;

        const resultado = await pool.query(
            `
            UPDATE operadores
            SET nombre = $1,
                telefono = $2,
                foto = $3,
                estado = $4
            WHERE id = $5
            RETURNING *
            `,
            [nombre, telefono, foto, estado, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Operador no encontrado' });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar operador' });
    }
}

module.exports = {
    obtenerOperadores,
    crearOperador,
    actualizarOperador
};
