-- ============================================================
-- BiciOps - Esquema de base de datos
-- Se ejecuta automáticamente al crear el contenedor de Postgres
-- (montado en /docker-entrypoint-initdb.d/ vía docker-compose)
-- ============================================================

-- Tabla de operadores
CREATE TABLE IF NOT EXISTS operadores (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    telefono    VARCHAR(20),
    foto        TEXT,
    estado      VARCHAR(20) NOT NULL DEFAULT 'Activo'
                CHECK (estado IN ('Activo', 'Inactivo'))
);

-- Tabla de vehículos
-- operador_id es llave foránea hacia operadores.
-- ON DELETE SET NULL: si se elimina un operador, el vehículo
-- queda sin operador asignado (no se borra el vehículo).
CREATE TABLE IF NOT EXISTS vehiculos (
    id          SERIAL PRIMARY KEY,
    unidad      VARCHAR(10) NOT NULL UNIQUE,
    tipo        VARCHAR(30) NOT NULL DEFAULT 'Bicitaxi',
    estado      VARCHAR(30) NOT NULL DEFAULT 'Activo'
                CHECK (estado IN ('Activo', 'En mantenimiento', 'Descompuesto')),
    operador_id INTEGER,
    CONSTRAINT fk_vehiculos_operador
        FOREIGN KEY (operador_id)
        REFERENCES operadores (id)
        ON DELETE SET NULL
);

-- Tabla de inspecciones
-- vehiculo_id es llave foránea hacia vehiculos.
-- ON DELETE CASCADE: si se elimina un vehículo, sus inspecciones
-- se eliminan también (no tienen sentido sin el vehículo).
CREATE TABLE IF NOT EXISTS inspecciones (
    id            SERIAL PRIMARY KEY,
    vehiculo_id   INTEGER NOT NULL,
    fecha         TIMESTAMP NOT NULL DEFAULT NOW(),
    frenos        VARCHAR(20) NOT NULL,
    llantas       VARCHAR(20) NOT NULL,
    luces         VARCHAR(20) NOT NULL,
    cadena        VARCHAR(20) NOT NULL,
    resultado     VARCHAR(30) NOT NULL
                  CHECK (resultado IN ('Aprobado', 'Requiere mantenimiento')),
    observaciones TEXT,
    CONSTRAINT fk_inspecciones_vehiculo
        FOREIGN KEY (vehiculo_id)
        REFERENCES vehiculos (id)
        ON DELETE CASCADE
);

-- Tabla de mantenimientos
CREATE TABLE IF NOT EXISTS mantenimientos (
    id            SERIAL PRIMARY KEY,
    vehiculo_id   INTEGER NOT NULL,
    fecha         TIMESTAMP NOT NULL DEFAULT NOW(),
    servicio      VARCHAR(100) NOT NULL,
    costo         NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estado        VARCHAR(20) NOT NULL DEFAULT 'Pendiente'
                  CHECK (estado IN ('Pendiente', 'En proceso', 'Finalizado')),
    observaciones TEXT,
    CONSTRAINT fk_mantenimientos_vehiculo
        FOREIGN KEY (vehiculo_id)
        REFERENCES vehiculos (id)
        ON DELETE CASCADE
);

-- Índices sobre las llaves foráneas (mejoran los JOIN y filtros)
CREATE INDEX IF NOT EXISTS idx_vehiculos_operador_id      ON vehiculos (operador_id);
CREATE INDEX IF NOT EXISTS idx_inspecciones_vehiculo_id   ON inspecciones (vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_mantenimientos_vehiculo_id ON mantenimientos (vehiculo_id);
