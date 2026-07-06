const pool = require('../config/db');
const {
    actualizarEstadoVehiculoPorInspeccion
} = require('../helpers/estadoVehiculo');

// GET /api/inspecciones
async function obtenerInspecciones(req, res) {
    try {
        const resultado = await pool.query(
            `
            SELECT
                inspecciones.id,
                inspecciones.vehiculo_id,
                vehiculos.unidad,
                inspecciones.fecha,
                inspecciones.frenos,
                inspecciones.llantas,
                inspecciones.luces,
                inspecciones.cadena,
                inspecciones.resultado,
                inspecciones.observaciones
            FROM inspecciones
            JOIN vehiculos
                ON inspecciones.vehiculo_id = vehiculos.id
            ORDER BY inspecciones.id DESC
            `
        );

        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener inspecciones' });
    }
}

// POST /api/inspecciones
async function crearInspeccion(req, res) {
    try {
        const {
            vehiculo_id,
            frenos,
            llantas,
            luces,
            cadena,
            resultado,
            observaciones
        } = req.body;

        const resultadoQuery = await pool.query(
            `
            INSERT INTO inspecciones
                (vehiculo_id, frenos, llantas, luces, cadena, resultado, observaciones)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `,
            [vehiculo_id, frenos, llantas, luces, cadena, resultado, observaciones]
        );

        await actualizarEstadoVehiculoPorInspeccion(vehiculo_id, resultado);

        res.status(201).json(resultadoQuery.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al guardar inspección' });
    }
}

// PUT /api/inspecciones/:id
async function actualizarInspeccion(req, res) {
    try {
        const { id } = req.params;
        const {
            vehiculo_id,
            frenos,
            llantas,
            luces,
            cadena,
            resultado,
            observaciones
        } = req.body;

        const resultadoQuery = await pool.query(
            `
            UPDATE inspecciones
            SET vehiculo_id = $1,
                frenos = $2,
                llantas = $3,
                luces = $4,
                cadena = $5,
                resultado = $6,
                observaciones = $7
            WHERE id = $8
            RETURNING *
            `,
            [vehiculo_id, frenos, llantas, luces, cadena, resultado, observaciones, id]
        );

        if (resultadoQuery.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Inspección no encontrada' });
        }

        await actualizarEstadoVehiculoPorInspeccion(vehiculo_id, resultado);

        res.json(resultadoQuery.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar inspección' });
    }
}

module.exports = {
    obtenerInspecciones,
    crearInspeccion,
    actualizarInspeccion
};
