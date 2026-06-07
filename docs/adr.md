# Documento ADR — Architecture Decision Records

## HabitFlow · Decisiones Técnicas Justificadas

---

## ADR-001: Lenguaje de programación — JavaScript (Node.js + React)

**Fecha:** Abril 2026  
**Estado:** Aprobado

### Contexto
Se necesita un lenguaje que permita desarrollo ágil tanto en frontend como en backend, con una curva de aprendizaje razonable para un equipo pequeño y una comunidad de soporte amplia.

### Decisión
Usar **JavaScript** como lenguaje principal en ambas capas (isomorfismo de lenguaje).

### Justificación
| Criterio | JavaScript | Python + JS | Java + JS |
|----------|-----------|-------------|-----------|
| Lenguaje único | ✅ Frontend y backend | ❌ Dos lenguajes | ❌ Dos lenguajes |
| Ecosistema npm | ✅ Muy amplio | Parcial | Parcial |
| Velocidad de desarrollo | ✅ Alta | Media | Baja |
| Curva de aprendizaje | ✅ Baja-media | Media | Alta |
| JSON nativo | ✅ Sí | Requiere librería | Requiere librería |

### Consecuencias
- **Positivas:** Un solo lenguaje reduce el cambio de contexto mental. Se pueden compartir validaciones y tipos entre capas.
- **Negativas:** JavaScript tiene tipado débil, lo que puede generar errores en tiempo de ejecución. En un proyecto mayor se recomendaría TypeScript.

---

## ADR-002: Framework backend — Express.js

**Fecha:** Abril 2026  
**Estado:** Aprobado

### Contexto
El backend necesita exponer una API REST. Se requiere un framework maduro, ligero y con soporte para middleware personalizado.

### Decisión
Usar **Express.js** sobre Node.js.

### Justificación
| Criterio | Express | Fastify | NestJS |
|----------|---------|---------|--------|
| Madurez / documentación | ✅ Muy alta | Alta | Alta |
| Curva de aprendizaje | ✅ Baja | Media | Alta |
| Flexibilidad | ✅ Total | Alta | Media (opinionado) |
| Ecosistema de middleware | ✅ Muy amplio | Medio | Amplio |
| Overhead | ✅ Mínimo | Mínimo | Moderado |

### Consecuencias
- **Positivas:** Express es el estándar de facto para APIs REST en Node.js. Fácil de entender, depurar y mantener.
- **Negativas:** Al ser minimalista, requiere estructurar manualmente la arquitectura (carpetas, capas). En proyectos muy grandes, NestJS ofrecería más estructura desde el inicio.

---

## ADR-003: Framework frontend — React + Vite

**Fecha:** Abril 2026  
**Estado:** Aprobado

### Contexto
El frontend es una SPA (Single Page Application). Se necesita una librería reactiva con componentes reutilizables y herramienta de build moderna.

### Decisión
Usar **React 18** con **Vite** como herramienta de construcción.

### Justificación
| Criterio | React + Vite | Vue + Vite | Angular |
|----------|-------------|-----------|---------|
| Comunidad | ✅ La más grande | Grande | Grande |
| Rendimiento (HMR) | ✅ Muy rápido | Muy rápido | Moderado |
| Curva de aprendizaje | Media | ✅ Baja | Alta |
| Flexibilidad | ✅ Alta | Alta | Media |
| Ecosistema de librerías | ✅ Muy amplio | Amplio | Amplio |

**Por qué Vite sobre Create React App (CRA):**
- CRA está deprecado desde 2023.
- Vite usa ES modules nativos del navegador → arranque instantáneo y recarga en caliente en milisegundos.
- Configuración mínima y builds de producción optimizados con Rollup.

### Consecuencias
- **Positivas:** Desarrollo ágil con HMR ultrarrápido. React es altamente demandado en el mercado laboral.
- **Negativas:** React requiere decisiones adicionales sobre estado (Context API, Zustand, Redux). Para este proyecto se eligió Context API por su simplicidad.

---

## ADR-004: Tipo de arquitectura — Cliente-Servidor con API REST

**Fecha:** Abril 2026  
**Estado:** Aprobado

### Contexto
Se necesita definir cómo se comunican el frontend y el backend.

### Decisión
Arquitectura **cliente-servidor** con comunicación vía **API REST** (HTTP + JSON).

### Justificación
- **Desacoplamiento total:** el frontend y el backend pueden evolucionar, desplegarse y escalarse de forma independiente.
- **Stateless:** cada petición es autocontenida (lleva el JWT). No hay sesiones en el servidor, lo que facilita escalar horizontalmente agregando más instancias del backend.
- **Estándar universal:** REST con JSON es compatible con cualquier cliente futuro (móvil nativo, otro frontend, terceros).
- **Alternativa descartada (GraphQL):** agrega complejidad innecesaria para el tamaño actual del proyecto. REST con los endpoints definidos es suficiente.

### Consecuencias
- **Positivas:** Separación de responsabilidades clara. Fácil de documentar con Swagger/OpenAPI.
- **Negativas:** Para datos en tiempo real (notificaciones) se complementa con WebSocket (Socket.io), ya que REST puro no soporta comunicación bidireccional.

---

## ADR-005: Base de datos — MongoDB

**Fecha:** Abril 2026  
**Estado:** Aprobado

### Contexto
Se necesita una base de datos que se adapte bien a los datos del sistema: hábitos con estructura flexible, registros diarios variables y usuarios.

### Decisión
Usar **MongoDB** con **Mongoose** como ODM.

### Justificación
| Criterio | MongoDB | PostgreSQL | MySQL |
|----------|---------|-----------|-------|
| Esquema flexible | ✅ Sí (documentos) | No (rígido) | No (rígido) |
| Velocidad de prototipado | ✅ Alta | Media | Media |
| Escalabilidad horizontal | ✅ Nativa (sharding) | Compleja | Compleja |
| Relaciones complejas | Moderada | ✅ Excelente | Buena |
| JSON nativo | ✅ BSON | Requiere mapeo | Requiere mapeo |

**MongoDB es adecuado porque:**
- Los hábitos pueden tener categorías y campos opcionales que varían. Un esquema rígido obligaría a nullear muchos campos.
- El volumen de datos por usuario es pequeño. No se necesita la potencia relacional de PostgreSQL.
- Mongoose agrega validaciones y esquemas semi-estrictos, dando estructura sin perder flexibilidad.

### Consecuencias
- **Positivas:** Desarrollo rápido. Los documentos JSON mapean directamente a los objetos JavaScript.
- **Negativas:** Sin transacciones ACID nativas complejas (MongoDB las soporta desde v4 pero con limitaciones). Si el sistema creciera a manejar pagos o datos financieros, se evaluaría PostgreSQL.

---

## ADR-006: Autenticación — JWT (JSON Web Tokens)

**Fecha:** Abril 2026  
**Estado:** Aprobado

### Contexto
Se necesita un mecanismo de autenticación seguro y stateless para proteger los endpoints de la API.

### Decisión
Usar **JWT** con firma HMAC-SHA256 y expiración de **24 horas**.

### Justificación
- **Stateless:** el servidor no necesita almacenar sesiones. El token contiene toda la información necesaria (ID de usuario, expiración).
- **Estándar abierto (RFC 7519):** compatible con cualquier cliente y fácil de validar.
- **Expiración 24h:** balance entre seguridad (token no válido indefinidamente) y usabilidad (el estudiante no tiene que reloguarse varias veces al día).
- **bcrypt para contraseñas:** las contraseñas nunca se almacenan en texto plano. Se usa bcrypt con factor de coste 10.

### Alternativa descartada
- **Sessions + cookies:** requiere almacenar estado en el servidor. Más complejo de escalar y de implementar con una SPA que consume la API desde dominios distintos.

### Consecuencias
- **Positivas:** Implementación simple, portable entre dispositivos y clientes.
- **Negativas:** Una vez emitido, el JWT no puede revocarse antes de su expiración sin implementar una blacklist. Para este MVP es aceptable: al hacer logout se elimina del localStorage del cliente.

---

## ADR-007: Herramientas de calidad — ESLint + Prettier

**Fecha:** Abril 2026  
**Estado:** Aprobado

### Decisión
Incorporar **ESLint** para análisis estático y **Prettier** para formato de código.

### Justificación
- **ESLint** detecta errores potenciales (variables no usadas, hooks incorrectos en React) sin ejecutar el código.
- **Prettier** elimina las discusiones sobre estilo (punto y coma, comillas, indentación) aplicando un formato consistente automáticamente.
- La combinación ESLint + Prettier es el estándar de la industria en proyectos React/Node.js.

### Consecuencias
- **Positivas:** Código consistente desde el inicio. Reduce errores triviales. Facilita la revisión de código.
- **Negativas:** Requiere una configuración inicial y puede generar fricción si las reglas son muy estrictas. Se configuraron como `warn` (advertencia) en lugar de `error` para las reglas no críticas.
