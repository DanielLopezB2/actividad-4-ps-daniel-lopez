# Arquitectura del Sistema — Diagramas C4

## HabitFlow · Diagramas de Contexto y Contenedores

---

## Nivel 1: Diagrama de Contexto

El diagrama de contexto muestra el sistema HabitFlow y sus relaciones con los actores externos.

```
┌─────────────────────────────────────────────────────────────────┐
│                    [Sistema] HabitFlow                          │
│   Plataforma web para el seguimiento de microhábitos de         │
│   bienestar estudiantil                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
   ┌─────────────────┐  ┌───────────┐  ┌─────────────────────┐
   │   Estudiante    │  │  Docente  │  │  Dept. Bienestar    │
   │ universitario   │  │  / Tutor  │  │   Universitario     │
   │                 │  │           │  │                     │
   │ Usuario primario│  │ Usuario   │  │ Stakeholder externo │
   │ que registra y  │  │ secundario│  │ interesado en       │
   │ hace check-in   │  │ (futuro)  │  │ estadísticas        │
   │ de sus hábitos  │  │           │  │ agregadas           │
   └─────────────────┘  └───────────┘  └─────────────────────┘
```

### Descripción de actores

| Actor | Tipo | Descripción |
|-------|------|-------------|
| Estudiante universitario | Usuario primario | Joven de 18-30 años que registra, sigue y consulta sus microhábitos |
| Docente / Tutor | Usuario secundario | Puede consultar estadísticas agregadas del grupo (fase futura) |
| Dept. Bienestar Universitario | Stakeholder externo | Interesado en los datos de bienestar de la comunidad |

---

## Nivel 2: Diagrama de Contenedores

El diagrama de contenedores muestra cómo está descompuesto internamente el sistema HabitFlow.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Sistema HabitFlow                                   │
│                                                                             │
│  ┌──────────────────────┐          ┌──────────────────────────────────────┐ │
│  │   [Contenedor]       │  HTTPS   │   [Contenedor]                       │ │
│  │   Frontend SPA       │◄────────►│   Backend API REST                   │ │
│  │                      │  JSON    │                                      │ │
│  │   React 18 + Vite    │          │   Node.js + Express                  │ │
│  │                      │          │                                      │ │
│  │   · Páginas:         │          │   · Auth: /api/auth                  │ │
│  │     Login            │          │   · Hábitos: /api/habits             │ │
│  │     Register         │          │   · Docs: /api/docs (Swagger)        │ │
│  │     Dashboard        │          │   · Health: /api/health              │ │
│  │                      │          │                                      │ │
│  │   · Context API      │  WS      │   · Middleware JWT                   │ │
│  │     (AuthContext)    │◄────────►│   · Socket.io (notificaciones)       │ │
│  │   · Axios client     │          │   · bcrypt (seguridad)               │ │
│  └──────────────────────┘          └───────────────┬──────────────────────┘ │
│                                                    │                        │
│                                           Mongoose │ Driver                 │
│                                                    ▼                        │
│                                    ┌──────────────────────────────────────┐ │
│                                    │   [Contenedor]                       │ │
│                                    │   Base de Datos                      │ │
│                                    │                                      │ │
│                                    │   MongoDB (Atlas / local)            │ │
│                                    │                                      │ │
│                                    │   Colecciones:                       │ │
│                                    │   · users                            │ │
│                                    │   · habits                           │ │
│                                    │   · checkins (Sprint 3)              │ │
│                                    │   · notifications (Sprint 4)         │ │
│                                    └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Descripción de contenedores

| Contenedor | Tecnología | Responsabilidad |
|------------|-----------|-----------------|
| Frontend SPA | React 18 + Vite | Interfaz de usuario reactiva. Gestión de estado con Context API. Consumo de API REST vía Axios. |
| Backend API REST | Node.js + Express | Lógica de negocio, autenticación JWT, validaciones, comunicación con la base de datos. |
| Base de datos | MongoDB + Mongoose | Persistencia de usuarios, hábitos y registros diarios. Documentos NoSQL con referencias por ObjectId. |

### Flujo principal de comunicación

1. El **estudiante** accede al Frontend desde su navegador (Chrome, Firefox, Safari).
2. El **Frontend** realiza peticiones HTTP/REST al **Backend** usando Axios con JWT en el header.
3. El **Backend** valida el token con middleware, ejecuta la lógica y consulta/escribe en **MongoDB**.
4. Para notificaciones en tiempo real, el **Frontend** establece una conexión **WebSocket** con el Backend via **Socket.io**.
5. El **Backend** responde con datos JSON que el Frontend renderiza de forma reactiva.

### Servicios externos

| Servicio | Propósito |
|----------|-----------|
| MongoDB Atlas | Base de datos en la nube (alternativa a MongoDB local) |
| Render / Railway | Plataforma de despliegue del backend (staging) |
| Vercel / Netlify | Hosting del frontend estático |

---

## Decisiones de diseño arquitectónico

- **Cliente-Servidor con API REST**: desacoplamiento total entre frontend y backend. El frontend puede cambiar de framework sin afectar el backend y viceversa.
- **Stateless**: el backend no guarda estado de sesión. El JWT viaja en cada petición y el servidor lo verifica en memoria, lo que facilita la escalabilidad horizontal.
- **Soft Delete**: los hábitos eliminados se marcan como `activo: false` en lugar de borrarse de la base de datos, preservando el historial del usuario.
- **Proxy en desarrollo**: Vite redirige `/api` al backend local, eliminando problemas de CORS durante el desarrollo.
