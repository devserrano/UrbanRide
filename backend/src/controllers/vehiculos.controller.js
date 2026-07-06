const pool = require('../config/db');

// GET /api/vehiculos
async function obtenerVehiculos(req, res) {
    try {
        const resultado = await pool.query(
            `
            SELECT
                vehiculos.id,
                vehiculos.unidad,
                vehiculos.tipo,
                vehiculos.estado,
                vehiculos.operador_id,
                operadores.nombre AS operador
            FROM vehiculos
            LEFT JOIN operadores
                ON vehiculos.operador_id = operadores.id
            ORDER BY vehiculos.id ASC
            `
        );

        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
}

// POST /api/vehiculos
async function crearVehiculo(req, res) {
    try {
        const { unidad, tipo, estado, operador_id } = req.body;

        const resultado = await pool.query(
            `
            INSERT INTO vehiculos (unidad, tipo, estado, operador_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [unidad, tipo, estado, operador_id]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al agregar vehículo' });
    }
}

// PUT /api/vehiculos/:id
async function actualizarVehiculo(req, res) {
    try {
        const { id } = req.params;
        const { operador_id, estado } = req.body;

        const resultado = await pool.query(
            `
            UPDATE vehiculos
            SET operador_id = $1,
                estado = $2
            WHERE id = $3
            RETURNING *
            `,
            [operador_id, estado, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar vehículo' });
    }
}

// DELETE /api/vehiculos/:id
async function eliminarVehiculo(req, res) {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM vehiculos WHERE id = $1', [id]);

        res.json({ mensaje: 'Vehículo eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar vehículo' });
    }
}

module.exports = {
    obtenerVehiculos,
    crearVehiculo,
    actualizarVehiculo,
    eliminarVehiculo
};
