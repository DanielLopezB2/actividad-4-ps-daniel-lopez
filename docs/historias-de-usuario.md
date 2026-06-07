# Historias de Usuario — HabitFlow (Segunda Entrega)

> Actualización del MVP con criterios de aceptación detallados.

---

## HU-01 · Registro de usuario · Prioridad: Alta

**Como** estudiante universitario sin cuenta,  
**quiero** registrarme en la plataforma con mi nombre, correo y contraseña,  
**para** acceder a mis hábitos desde cualquier dispositivo de forma segura.

### Criterios de aceptación
- El formulario de registro solicita: nombre completo, correo electrónico y contraseña (mínimo 6 caracteres).
- Si el correo ya está registrado, el sistema muestra el mensaje: *"El correo ya está registrado."*
- La contraseña se almacena como hash (bcrypt) y nunca en texto plano.
- Al completar el registro exitosamente, el usuario es redirigido al dashboard sin pasos adicionales.
- El sistema retorna un JWT válido por 24 horas.

---

## HU-02 · Inicio de sesión · Prioridad: Alta

**Como** usuario registrado,  
**quiero** iniciar sesión con mi correo y contraseña,  
**para** acceder a mis hábitos de forma segura sin volver a registrarme.

### Criterios de aceptación
- Si las credenciales son correctas, el usuario accede al dashboard y recibe un nuevo JWT.
- Si las credenciales son incorrectas, se muestra: *"Credenciales inválidas."* sin indicar cuál campo falló (seguridad).
- El token se persiste en `localStorage` y se adjunta automáticamente en cada petición.
- Las rutas protegidas redirigen al login si no hay token válido.

---

## HU-03 · Crear hábito · Prioridad: Alta

**Como** usuario autenticado,  
**quiero** crear un hábito nuevo indicando nombre, categoría, frecuencia y hora de recordatorio,  
**para** tener un plan claro de los comportamientos que quiero desarrollar.

### Criterios de aceptación
- El formulario requiere como mínimo: nombre y categoría.
- Las categorías disponibles son: salud, estudio, ejercicio, bienestar, otro.
- Las frecuencias disponibles son: diario, semanal.
- La hora de recordatorio es opcional.
- El hábito creado aparece inmediatamente en el dashboard sin recargar la página.
- El sistema confirma la creación con el hábito visible en la lista.

---

## HU-04 · Editar o eliminar hábito · Prioridad: Alta

**Como** usuario activo,  
**quiero** poder editar o eliminar mis hábitos,  
**para** mantener mi lista actualizada y enfocada en lo que hoy es relevante.

### Criterios de aceptación
- El botón "Editar" abre el formulario precargado con los datos del hábito.
- Los cambios se guardan sin perder el historial existente.
- El botón "Eliminar" pide confirmación antes de proceder.
- La eliminación es un soft delete (el hábito se marca como `activo: false`) y desaparece de la vista.
- Solo el propietario del hábito puede editarlo o eliminarlo.

---

## HU-05 · Visualizar hábitos del día · Prioridad: Alta

**Como** usuario autenticado,  
**quiero** ver todos mis hábitos activos en el dashboard,  
**para** tener un panorama claro de mis compromisos diarios.

### Criterios de aceptación
- El dashboard muestra todos los hábitos activos del usuario autenticado.
- Cada hábito muestra: nombre, categoría (con color diferenciado), frecuencia y hora de recordatorio (si aplica).
- Si no hay hábitos, se muestra un mensaje invitando a crear el primero.
- La vista es responsiva y funciona correctamente en móvil y escritorio.

---

## HU-06 · Cerrar sesión · Prioridad: Alta

**Como** usuario autenticado,  
**quiero** cerrar sesión de forma segura,  
**para** proteger mi cuenta cuando uso un dispositivo compartido.

### Criterios de aceptación
- El botón "Cerrar sesión" está accesible desde la barra de navegación.
- Al cerrar sesión se elimina el token del `localStorage`.
- El usuario es redirigido a la pantalla de login.
- Intentar acceder a rutas protegidas después del cierre de sesión redirige al login.

---

## HU-07 · Notificaciones de recordatorio · Prioridad: Media

**Como** usuario ocupado,  
**quiero** recibir una notificación cuando se acerca la hora de un hábito pendiente,  
**para** no olvidar mis compromisos de bienestar durante el día.

### Criterios de aceptación
- El sistema verifica cada minuto si existe algún hábito cuya `hora_recordatorio` coincide con la hora actual (±5 minutos).
- La notificación aparece en pantalla sin que el usuario tenga que recargar.
- La notificación incluye el nombre del hábito y un mensaje motivacional.
- El sistema usa Socket.io para la comunicación en tiempo real.
- Si el usuario no está conectado, la notificación queda pendiente para el próximo inicio de sesión.

---

## Resumen de prioridades

| ID | Historia | Prioridad | Estado en Sprint 1-2 |
|----|----------|-----------|----------------------|
| HU-01 | Registro de usuario | Alta | ✅ Implementada |
| HU-02 | Inicio de sesión | Alta | ✅ Implementada |
| HU-03 | Crear hábito | Alta | ✅ Implementada |
| HU-04 | Editar / eliminar hábito | Alta | ✅ Implementada |
| HU-05 | Visualizar hábitos del día | Alta | ✅ Implementada |
| HU-06 | Cerrar sesión | Alta | ✅ Implementada |
| HU-07 | Notificaciones de recordatorio | Media | 🔜 Sprint 3 |
