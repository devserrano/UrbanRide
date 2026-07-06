# 🚲 BiciOps

**Sistema de gestión operativa para flotillas de bicitaxis**

Plataforma full-stack para administrar vehículos, operadores, inspecciones técnicas y mantenimientos, con sincronización automática del estado de cada unidad según las reglas del negocio.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 📋 Tabla de contenido
 
- [Descripción](#-descripción)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Modelo de datos](#-modelo-de-datos)
- [Reglas de negocio](#-reglas-de-negocio)
- [Tecnologías](#-tecnologías)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Variables de entorno](#-variables-de-entorno)
- [API](#-api)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Roadmap](#-roadmap)
- [Autor](#-autor)
---
 
## 📖 Descripción
 
BiciOps resuelve un problema operativo real: los dueños de flotillas de bicitaxis suelen llevar el control de sus unidades, choferes y reparaciones en papel o en hojas de cálculo dispersas. Este sistema centraliza esa operación en un dashboard web donde el estado de cada vehículo (**Activo**, **En mantenimiento**, **Descompuesto**) se actualiza automáticamente a partir de las inspecciones técnicas y del ciclo de vida de los mantenimientos — sin capturas manuales redundantes ni información desactualizada.
 
## ✨ Características
 
- **Gestión de vehículos** — CRUD completo con asignación de operador y control de estado.
- **Gestión de operadores** — registro, edición y relación con su unidad asignada.
- **Inspecciones técnicas** — checklist de frenos, llantas, luces y cadena; el resultado (*Aprobado* / *Requiere mantenimiento*) actualiza automáticamente el estado del vehículo.
- **Mantenimientos** — registro con servicio, costo y estado (*Pendiente* / *En proceso* / *Finalizado*); al finalizar, el vehículo se reactiva automáticamente.
- **Dashboard operativo** — resumen de la flotilla con indicadores y alertas.
- **Integridad garantizada por la base de datos** — llaves foráneas, `CHECK` constraints e índices; las reglas se cumplen aunque el backend falle.
- **Entorno reproducible** — la base de datos corre en Docker y el schema se inicializa automáticamente al crear el contenedor.
## 🏗 Arquitectura
 
Backend organizado en capas, con separación de responsabilidades:
 
```
Cliente (frontend)
      │  HTTP / JSON
      ▼
┌─────────────────────────────────────────────┐
│                  Express                     │
│                                              │
│  routes/        → definición de endpoints    │
│  controllers/   → manejo de request/response │
│  helpers/       → reglas de negocio          │
│  config/db.js   → pool de conexiones (pg)    │
└─────────────────────────────────────────────┘
      │  SQL parametrizado
      ▼
PostgreSQL 16 (Docker)
```
 
## 🗄 Modelo de datos
 
```
operadores 1 ──── N vehiculos 1 ──── N inspecciones
                       │
                       └──────────── N mantenimientos
```
 
| Relación | Llave foránea | Política de borrado | Justificación |
|---|---|---|---|
| vehiculos → operadores | `operador_id` | `ON DELETE SET NULL` | El vehículo es un activo de la empresa: si el operador se elimina, la unidad se conserva y queda disponible para reasignación. |
| inspecciones → vehiculos | `vehiculo_id` | `ON DELETE CASCADE` | Una inspección sin vehículo es un registro huérfano sin significado. |
| mantenimientos → vehiculos | `vehiculo_id` | `ON DELETE CASCADE` | El historial de mantenimiento depende por completo de la unidad. |
 
Además, el schema define `CHECK` constraints para los estados válidos, `UNIQUE` sobre el número de unidad e índices sobre todas las llaves foráneas para optimizar los `JOIN`.
 
> 💡 El repositorio incluye [`database/migracion_llaves_foraneas.sql`](database/migracion_llaves_foraneas.sql): la migración transaccional que agregó las llaves foráneas a la base de datos original, limpiando primero los registros huérfanos y eliminando una columna redundante (normalización).
 
## ⚙️ Reglas de negocio
 
El estado de cada vehículo se sincroniza automáticamente:
 
| Evento | Efecto sobre el vehículo |
|---|---|
| Inspección con resultado *Requiere mantenimiento* | → `En mantenimiento` |
| Inspección con resultado *Aprobado* | → `Activo` |
| Mantenimiento creado (*Pendiente* / *En proceso*) | → `En mantenimiento` |
| Mantenimiento *Finalizado* | → `Activo` |
| Vehículo `Descompuesto` | ⛔ No cambia automáticamente: requiere intervención manual |
 
Esta lógica vive centralizada en [`backend/src/helpers/estadoVehiculo.js`](backend/src/helpers/estadoVehiculo.js), de modo que existe una única fuente de verdad para la regla.
 
## 🛠 Tecnologías
 
| Capa | Tecnología |
|---|---|
| Backend | Node.js, Express 5 |
| Base de datos | PostgreSQL 16 (driver `pg` con pool de conexiones) |
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Infraestructura | Docker / Docker Compose |
| Control de versiones | Git / GitHub |
 
## 🚀 Instalación y ejecución
 
### Requisitos previos
 
- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) y Docker Compose
### 1. Clonar el repositorio
 
```bash
git clone https://github.com/devserrano/UrbanRide.git
cd UrbanRide
```
 
### 2. Levantar la base de datos
 
```bash
docker compose up -d
```
 
El schema completo ([`database/init.sql`](database/init.sql)) se ejecuta automáticamente la primera vez que se crea el contenedor. Para cargar datos de demostración:
 
```bash
docker exec -i bicitaxi_db psql -U admin -d bicitaxi_db < database/datos_prueba.sql
```
 
### 3. Iniciar el backend
 
```bash
cd backend
npm install
npm start        # o: npm run dev (recarga automática)
```
 
El servidor queda disponible en `http://localhost:3000`.
 
### 4. Abrir el frontend
 
Abrir `frontend/index.html` en el navegador (por ejemplo, con la extensión **Live Server** de VS Code).
 
## 🔐 Variables de entorno
 
La conexión a la base de datos se configura mediante variables de entorno, con valores por defecto para desarrollo local. En un despliegue real, las credenciales se inyectan desde el entorno y nunca se versionan en el código.
 
| Variable | Descripción | Default (desarrollo) |
|---|---|---|
| `PORT` | Puerto del servidor Express | `3000` |
| `DB_USER` | Usuario de PostgreSQL | `admin` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_NAME` | Nombre de la base de datos | `bicitaxi_db` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `admin123` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
 
## 📡 API
 
Todas las consultas se ejecutan con **queries parametrizadas** (prevención de inyección SQL).
 
### Vehículos
 
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/vehiculos` | Lista los vehículos con su operador (`LEFT JOIN`: incluye unidades sin asignar) |
| `POST` | `/api/vehiculos` | Registra un vehículo |
| `PUT` | `/api/vehiculos/:id` | Actualiza operador y estado |
| `DELETE` | `/api/vehiculos/:id` | Elimina un vehículo (cascada hacia inspecciones y mantenimientos) |
 
### Operadores
 
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/operadores` | Lista los operadores con su unidad asignada |
| `POST` | `/api/operadores` | Registra un operador |
| `PUT` | `/api/operadores/:id` | Actualiza un operador |
 
### Inspecciones
 
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/inspecciones` | Lista las inspecciones con la unidad inspeccionada |
| `POST` | `/api/inspecciones` | Registra una inspección **y sincroniza el estado del vehículo** |
| `PUT` | `/api/inspecciones/:id` | Actualiza una inspección |
 
### Mantenimientos
 
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/mantenimientos` | Lista los mantenimientos con la unidad correspondiente |
| `POST` | `/api/mantenimientos` | Registra un mantenimiento **y sincroniza el estado del vehículo** |
| `PUT` | `/api/mantenimientos/:id` | Actualiza un mantenimiento |
| `PUT` | `/api/mantenimientos/:id/finalizar` | Finaliza un mantenimiento **y reactiva el vehículo** |
 
## 📁 Estructura del proyecto
 
```
bicitaxi/
├── backend/
│   ├── server.js                        # Punto de entrada: middlewares y montaje de rutas
│   └── src/
│       ├── config/
│       │   └── db.js                    # Pool de conexiones (variables de entorno)
│       ├── routes/                      # Definición de endpoints por módulo
│       ├── controllers/                 # Lógica de cada endpoint
│       └── helpers/
│           └── estadoVehiculo.js        # Reglas de negocio del estado del vehículo
├── database/
│   ├── init.sql                         # Schema completo: tablas, FKs, constraints, índices
│   ├── migracion_llaves_foraneas.sql    # Migración transaccional para bases existentes
│   └── datos_prueba.sql                 # Datos de demostración
├── frontend/
│   ├── index.html
│   ├── css/
│   └── js/
└── docker-compose.yml
```
 
## 🗺 Roadmap
 
- [x] CRUD completo de los cuatro módulos
- [x] Sincronización automática del estado del vehículo
- [x] Refactor a arquitectura por capas (rutas / controladores / helpers)
- [x] Llaves foráneas formales + migración de la base de datos original
- [ ] Transacciones en operaciones de múltiples pasos (inspección + actualización de estado)
- [ ] Validación de entrada y códigos de estado HTTP semánticos (400 / 409)
- [ ] Autenticación con JWT y roles de usuario
- [ ] Dockerización del backend (compose completo)
- [ ] Reportes exportables (PDF / Excel)
- [ ] App móvil para operadores y rastreo GPS (PostGIS)
## 👤 Autor
 
**Diego Serrano** — Ingeniería en Computación, UNAM
 
[![GitHub](https://img.shields.io/badge/GitHub-devserrano-181717?style=flat&logo=github)](https://github.com/devserrano)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-serranodev-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/serranodev)
