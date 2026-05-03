# HabitFlow 🌱

Plataforma web para el seguimiento de microhábitos de bienestar estudiantil.

**Proyecto de Software — Corporación Universitaria Iberoamericana**  
Autor: Daniel López Bedoya | Sprint 1-2

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express |
| Base de datos | MongoDB + Mongoose |
| Autenticación | JWT (24h) + bcryptjs |
| Calidad | ESLint + Prettier |

## Estructura del proyecto

```
habitflow/
├── backend/          # API REST (Node.js + Express)
│   ├── src/
│   │   ├── config/   # Conexión a MongoDB
│   │   ├── controllers/
│   │   ├── middleware/  # Autenticación JWT
│   │   ├── models/   # Mongoose schemas
│   │   └── routes/
│   └── server.js
├── frontend/         # SPA (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/  # AuthContext
│   │   ├── pages/
│   │   └── services/ # Axios API client
│   └── vite.config.js
└── docs/             # Documentación del proyecto
```

## Instalación y ejecución

### Backend

```bash
cd backend
npm install
cp .env.example .env   # configurar variables
npm run dev
```

API disponible en `http://localhost:5000`  
Documentación Swagger: `http://localhost:5000/api/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponible en `http://localhost:3000`

## Funcionalidades implementadas (Sprint 1-2)

### Funcionalidad 1: Autenticación de usuarios (RF-01, RF-02, RF-10)
- Registro con nombre, correo y contraseña (hash bcrypt)
- Login con JWT (expiración 24h)
- Rutas protegidas con middleware
- Cierre de sesión seguro

### Funcionalidad 2: Gestión de hábitos (RF-03, RF-08)
- Crear hábitos con categoría, frecuencia y hora de recordatorio
- Listar hábitos del usuario autenticado
- Editar hábitos existentes
- Eliminar hábitos (soft delete)

## Ramas del repositorio

| Rama | Propósito |
|------|-----------|
| `main` | Versión estable / producción |
| `feature/auth` | Módulo de autenticación |
| `feature/habits-crud` | CRUD de hábitos |

## Endpoints API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registrar usuario |
| POST | `/api/auth/login` | No | Iniciar sesión |
| GET | `/api/auth/perfil` | Sí | Obtener perfil |
| GET | `/api/habits` | Sí | Listar hábitos |
| POST | `/api/habits` | Sí | Crear hábito |
| PUT | `/api/habits/:id` | Sí | Actualizar hábito |
| DELETE | `/api/habits/:id` | Sí | Eliminar hábito |
