# Retrospectiva del Sprint 1-2

## HabitFlow · Segunda Entrega

**Período:** Semanas 1-4 de desarrollo  
**Metodología:** Scrum (retrospectiva al final del Sprint 2)  
**Fecha:** 29 de abril de 2026

---

## ¿Qué funcionó bien?

- **La arquitectura cliente-servidor resultó ser la decisión correcta.** Separar el frontend del backend permitió trabajar en ambas capas de forma independiente, sin bloqueos. Cuando el backend tenía un endpoint listo, el frontend pudo consumirlo de inmediato.

- **Vite + React aceleró enormemente el desarrollo del frontend.** El Hot Module Replacement (HMR) permitió ver los cambios en tiempo real, lo que hizo que la iteración sobre el diseño de las páginas fuera muy rápida.

- **Mongoose simplificó la interacción con MongoDB.** Las validaciones a nivel de schema evitaron que llegaran datos inválidos a la base de datos, reduciendo la cantidad de validaciones manuales en los controladores.

- **El middleware de autenticación JWT funcionó desde el primer intento.** Al centralizar la verificación del token en un solo middleware, todas las rutas protegidas quedaron aseguradas automáticamente sin duplicar lógica.

- **Las pruebas de usabilidad revelaron problemas reales antes del siguiente Sprint.** Descubrir que el botón "Nuevo hábito" era difícil de encontrar en mobile es exactamente el tipo de feedback que un solo desarrollador no puede detectar en su propia pantalla.

---

## ¿Qué dificultades se presentaron?

- **La configuración de CORS tomó más tiempo del esperado.** Al principio el frontend no podía comunicarse con el backend por un error de política de origen cruzado. Se resolvió configurando el proxy de Vite para desarrollo y el middleware `cors` en Express.

- **El manejo del estado de autenticación en React requirió más iteraciones de las previstas.** El primer enfoque con `useState` local generó inconsistencias cuando el token expiraba. Se refactorizó a `Context API` con verificación automática al cargar la app.

- **El tiempo de desarrollo fue ajustado al trabajar individualmente con todos los roles Scrum.** Asumir Product Owner, Scrum Master y Developer simultáneamente generó tensión entre definir qué construir y construirlo. Se manejó con listas de tareas diarias muy específicas.

- **Las dotfiles (.env, .gitignore) requirieron configuración de permisos adicional** en el entorno de desarrollo local, lo que generó una demora menor al inicio del sprint.

---

## ¿Qué se mejorará en el siguiente Sprint?

- **Sprint 3 incluirá el módulo de check-in diario** (RF-04) y el cálculo de rachas (RF-05). Estos son los requisitos de mayor impacto para la retención del usuario y son la razón de ser de HabitFlow.

- **Se implementará el botón flotante (FAB) en mobile** para resolver el problema de descubrimiento identificado en las pruebas de usabilidad.

- **Se diferenciará visualmente los botones de acción** (Editar en azul, Eliminar en rojo) para prevenir clics accidentales.

- **Se agregará feedback visual de carga** (spinners) en todas las operaciones asíncronas para mejorar la percepción de rendimiento.

- **Se incorporará el panel de estadísticas básico** (RF-06) con Chart.js: racha actual, racha máxima y porcentaje de cumplimiento semanal.

- **Se definirán pruebas de integración básicas** para los endpoints críticos (register, login, CRUD de hábitos) con el fin de evitar regresiones en sprints futuros.

---

**Firmado:**

Daniel López Bedoya  
Product Owner · Scrum Master · Developer  
Proyecto HabitFlow — Corporación Universitaria Iberoamericana  
29 de abril de 2026
