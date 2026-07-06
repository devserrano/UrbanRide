-- Datos de prueba para BiciOps

INSERT INTO operadores (nombre, telefono, foto, estado) VALUES
('Juan Pérez',      '5512345678', NULL, 'Activo'),
('María López',     '5523456789', NULL, 'Activo'),
('Carlos Ramírez',  '5534567890', NULL, 'Activo'),
('Ana Torres',      '5545678901', NULL, 'Activo'),
('Luis Hernández',  '5556789012', NULL, 'Inactivo');

INSERT INTO vehiculos (unidad, tipo, estado, operador_id) VALUES
('BT-01', 'Bicitaxi', 'Activo',           1),
('BT-02', 'Bicitaxi', 'Activo',           2),
('BT-03', 'Bicitaxi', 'En mantenimiento', 3),
('BT-04', 'Bicitaxi', 'Activo',           4),
('BT-05', 'Bicitaxi', 'Descompuesto',     NULL),
('BT-06', 'Bicitaxi', 'Activo',           NULL);

INSERT INTO inspecciones (vehiculo_id, frenos, llantas, luces, cadena, resultado, observaciones) VALUES
(1, 'Bien', 'Bien',    'Bien',    'Bien', 'Aprobado',               'Todo en orden'),
(2, 'Bien', 'Regular', 'Bien',    'Bien', 'Aprobado',               'Llantas con desgaste leve'),
(3, 'Mal',  'Regular', 'Bien',    'Mal',  'Requiere mantenimiento', 'Frenos flojos y cadena oxidada'),
(4, 'Bien', 'Bien',    'Regular', 'Bien', 'Aprobado',               'Cambiar foco delantero pronto'),
(5, 'Mal',  'Mal',     'Mal',     'Mal',  'Requiere mantenimiento', 'Unidad fuera de servicio');

INSERT INTO mantenimientos (vehiculo_id, servicio, costo, estado, observaciones) VALUES
(3, 'Ajuste de frenos y cambio de cadena', 450.00, 'En proceso', 'Refacciones ya compradas'),
(1, 'Servicio general preventivo',         250.00, 'Finalizado', 'Lubricación y ajuste'),
(2, 'Cambio de llanta trasera',            320.00, 'Finalizado', NULL),
(5, 'Reparación mayor de transmisión',    1200.00, 'Pendiente',  'Esperando cotización');
