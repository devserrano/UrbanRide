# BiciOps 🚲

Sistema de gestión operativa para flotillas de bicitaxis.

## Características

- Gestión de vehículos y operadores
- Inspecciones técnicas con actualización automática del estado del vehículo
- Registro y seguimiento de mantenimientos
- Dashboard operativo con alertas
- Interfaz moderna tipo SaaS

## Tecnologías

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** Node.js + Express (arquitectura por capas: rutas / controladores / helpers)
- **Base de datos:** PostgreSQL con llaves foráneas e integridad referencial
- **Contenedores:** Docker (Postgres con schema auto-inicializado)

## Modelo de datos

```plaintext
operadores 1 ──── N vehiculos 1 ──── N inspecciones
                       │
                       └──────────── N mantenimientos
```

- `vehiculos.operador_id → operadores.id` (ON DELETE SET NULL)
- `inspecciones.vehiculo_id → vehiculos.id` (ON DELETE CASCADE)
- `mantenimientos.vehiculo_id → vehiculos.id` (ON DELETE CASCADE)

## Instalación

### 1. Base de datos (Docker)

```bash
docker compose up -d
```

El schema (`database/init.sql`) se ejecuta automáticamente al crear el contenedor.

> Si ya tienes una base de datos existente sin llaves foráneas, ejecuta una vez:
> ```bash
> psql -U admin -d bicitaxi_db -f database/migracion_llaves_foraneas.sql
> ```

### 2. Backend

```bash
cd backend
npm install
npm start        # o npm run dev para recarga automática
```

La conexión a la base de datos se configura con variables de entorno
(`DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`), con valores
por defecto para desarrollo local.

### 3. Frontend

Abrir `frontend/index.html` con Live Server.

## Estructura del proyecto

```plaintext
bicitaxi/
│
├── backend/
│   ├── server.js                  # Punto de entrada: middlewares y montaje de rutas
│   └── src/
│       ├── config/
│       │   └── db.js              # Pool de conexión (variables de entorno)
│       ├── routes/                # Definición de endpoints por módulo
│       │   ├── vehiculos.routes.js
│       │   ├── operadores.routes.js
│       │   ├── inspecciones.routes.js
│       │   └── mantenimientos.routes.js
│       ├── controllers/           # Lógica de cada endpoint
│       │   ├── vehiculos.controller.js
│       │   ├── operadores.controller.js
│       │   ├── inspecciones.controller.js
│       │   └── mantenimientos.controller.js
│       └── helpers/
│           └── estadoVehiculo.js  # Reglas de negocio del estado del vehículo
│
├── database/
│   ├── init.sql                        # Schema completo con llaves foráneas
│   └── migracion_llaves_foraneas.sql   # Migración para bases existentes
│
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
│
└── docker-compose.yml
```

## API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/vehiculos | Lista vehículos con su operador (LEFT JOIN) |
| POST   | /api/vehiculos | Crea un vehículo |
| PUT    | /api/vehiculos/:id | Actualiza operador y estado |
| DELETE | /api/vehiculos/:id | Elimina un vehículo (cascada a inspecciones/mantenimientos) |
| GET/POST/PUT | /api/operadores | CRUD de operadores |
| GET/POST/PUT | /api/inspecciones | CRUD de inspecciones |
| GET/POST/PUT | /api/mantenimientos | CRUD de mantenimientos |
| PUT    | /api/mantenimientos/:id/finalizar | Finaliza un mantenimiento y reactiva el vehículo |

## Autor

Diego Serrano
Ingeniería en Computación - UNAM
