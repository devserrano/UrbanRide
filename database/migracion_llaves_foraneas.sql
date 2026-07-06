-- ============================================================
-- Migración: agregar llaves foráneas a una base de datos EXISTENTE
-- Ejecutar UNA sola vez sobre tu base actual (bicitaxi_db):
--   psql -U admin -d bicitaxi_db -f database/migracion_llaves_foraneas.sql
-- o pegar el contenido en tu cliente de SQL.
-- ============================================================

BEGIN;

-- 1. Limpiar datos huérfanos antes de crear las FKs
--    (registros que apuntan a ids que ya no existen romperían la migración)

UPDATE vehiculos
SET operador_id = NULL
WHERE operador_id IS NOT NULL
  AND operador_id NOT IN (SELECT id FROM operadores);

DELETE FROM inspecciones
WHERE vehiculo_id NOT IN (SELECT id FROM vehiculos);

DELETE FROM mantenimientos
WHERE vehiculo_id NOT IN (SELECT id FROM vehiculos);

-- 2. Eliminar la columna de texto duplicada 'operador' en vehiculos
--    (la relación correcta es operador_id -> operadores.id)
ALTER TABLE vehiculos DROP COLUMN IF EXISTS operador;

-- 3. Agregar las llaves foráneas

ALTER TABLE vehiculos
    DROP CONSTRAINT IF EXISTS fk_vehiculos_operador,
    ADD CONSTRAINT fk_vehiculos_operador
        FOREIGN KEY (operador_id)
        REFERENCES operadores (id)
        ON DELETE SET NULL;

ALTER TABLE inspecciones
    DROP CONSTRAINT IF EXISTS fk_inspecciones_vehiculo,
    ADD CONSTRAINT fk_inspecciones_vehiculo
        FOREIGN KEY (vehiculo_id)
        REFERENCES vehiculos (id)
        ON DELETE CASCADE;

ALTER TABLE mantenimientos
    DROP CONSTRAINT IF EXISTS fk_mantenimientos_vehiculo,
    ADD CONSTRAINT fk_mantenimientos_vehiculo
        FOREIGN KEY (vehiculo_id)
        REFERENCES vehiculos (id)
        ON DELETE CASCADE;

-- 4. Índices sobre las llaves foráneas
CREATE INDEX IF NOT EXISTS idx_vehiculos_operador_id      ON vehiculos (operador_id);
CREATE INDEX IF NOT EXISTS idx_inspecciones_vehiculo_id   ON inspecciones (vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_mantenimientos_vehiculo_id ON mantenimientos (vehiculo_id);

COMMIT;
