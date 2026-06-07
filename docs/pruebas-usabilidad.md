# Pruebas de Usabilidad — HabitFlow

## Segunda Entrega · Sprint 1-2

**Objetivo:** Validar que las interfaces de autenticación y gestión de hábitos sean intuitivas para el usuario objetivo (estudiantes universitarios), sin necesidad de instrucciones previas.

**Método:** Test de usuario remoto moderado. Cada participante realizó tareas específicas mientras el moderador observaba y registraba dificultades, tiempos y comentarios.

**Fecha de aplicación:** Abril 2026  
**Moderador:** Daniel López Bedoya

---

## Perfil de participantes

| # | Nombre | Edad | Carrera | Dispositivo |
|---|--------|------|---------|-------------|
| U1 | Santiago Morales | 21 | Ing. de Sistemas | Laptop (Chrome) |
| U2 | Valeria Ospina | 23 | Psicología | Celular (Safari) |
| U3 | Tomás Herrera | 20 | Contaduría | Laptop (Firefox) |
| U4 | Camila Ríos | 22 | Administración | Celular (Chrome) |
| U5 | Felipe Arango | 25 | Ing. Industrial | Laptop (Edge) |

---

## Tareas evaluadas

### Tarea 1: Registro de cuenta nueva
**Instrucción:** *"Creá una cuenta en HabitFlow usando tu correo y una contraseña a tu elección."*

| Usuario | Tiempo | Errores | Éxito |
|---------|--------|---------|-------|
| U1 | 45 seg | 0 | ✅ |
| U2 | 1 min 10 seg | 1 (confundió campo de confirmación) | ✅ |
| U3 | 38 seg | 0 | ✅ |
| U4 | 55 seg | 0 | ✅ |
| U5 | 42 seg | 0 | ✅ |

**Observaciones:**
- U2 intentó enviar el formulario sin completar el campo "confirmar contraseña" y se confundió con el mensaje de error. → **Mejora:** hacer más visible el campo de confirmación.
- 4 de 5 usuarios completaron la tarea en menos de 1 minuto. ✅ Cumple el criterio de usabilidad (≤ 5 min sin ayuda).

---

### Tarea 2: Inicio de sesión
**Instrucción:** *"Ahora cerrá la ventana y volvé a ingresar con tu cuenta."*

| Usuario | Tiempo | Errores | Éxito |
|---------|--------|---------|-------|
| U1 | 22 seg | 0 | ✅ |
| U2 | 30 seg | 0 | ✅ |
| U3 | 25 seg | 0 | ✅ |
| U4 | 28 seg | 0 | ✅ |
| U5 | 20 seg | 0 | ✅ |

**Observaciones:** Ningún usuario tuvo dificultades. El formulario de login es directo y claro.

---

### Tarea 3: Crear un hábito nuevo
**Instrucción:** *"Creá un hábito llamado 'Leer 20 minutos' de categoría Estudio, frecuencia diaria, con recordatorio a las 9:00 PM."*

| Usuario | Tiempo | Errores | Éxito |
|---------|--------|---------|-------|
| U1 | 1 min 05 seg | 0 | ✅ |
| U2 | 1 min 40 seg | 1 (no encontró el botón de inmediato) | ✅ |
| U3 | 1 min 12 seg | 0 | ✅ |
| U4 | 1 min 30 seg | 1 (buscó el botón en la parte inferior) | ✅ |
| U5 | 58 seg | 0 | ✅ |

**Observaciones:**
- U2 y U4 tardaron en encontrar el botón "Nuevo hábito" en la esquina superior derecha. → **Mejora identificada:** Agregar un botón flotante (FAB) o un mensaje más prominente cuando no hay hábitos.
- Todos completaron la tarea exitosamente.

---

### Tarea 4: Editar un hábito existente
**Instrucción:** *"Cambiá la categoría del hábito que creaste a 'Bienestar'."*

| Usuario | Tiempo | Errores | Éxito |
|---------|--------|---------|-------|
| U1 | 35 seg | 0 | ✅ |
| U2 | 52 seg | 0 | ✅ |
| U3 | 40 seg | 0 | ✅ |
| U4 | 1 min 05 seg | 1 (presionó "Eliminar" primero por error) | ✅ |
| U5 | 33 seg | 0 | ✅ |

**Observaciones:**
- U4 presionó "Eliminar" pensando que haría algo diferente. La confirmación evitó la pérdida de datos. → **Mejora:** Diferenciar visualmente más los botones de Editar y Eliminar.

---

### Tarea 5: Eliminar un hábito
**Instrucción:** *"Eliminá el hábito que creaste."*

| Usuario | Tiempo | Errores | Éxito |
|---------|--------|---------|-------|
| U1 | 18 seg | 0 | ✅ |
| U2 | 25 seg | 0 | ✅ |
| U3 | 20 seg | 0 | ✅ |
| U4 | 22 seg | 0 | ✅ |
| U5 | 15 seg | 0 | ✅ |

**Observaciones:** El cuadro de confirmación generó confianza. Todos los usuarios lo encontraron natural.

---

## Resultados globales

| Métrica | Resultado |
|---------|-----------|
| Tasa de éxito general | **100%** (25/25 tareas completadas) |
| Tiempo promedio por tarea | **48 segundos** |
| Errores totales | **4 errores recuperables** |
| Errores críticos (pérdida de datos) | **0** |
| Satisfacción promedio (1-5) | **4.2 / 5** |

---

## Comentarios cualitativos

> *"La pantalla de login se ve limpia y profesional, no me perdí para nada."* — U3

> *"Me gustó que cuando eliminé el hábito me preguntó si estaba segura, eso da tranquilidad."* — U2

> *"El formulario de nuevo hábito es claro, pero me costó encontrarlo al principio."* — U4

> *"El diseño oscuro se ve bien en el celular, no cansa la vista."* — U2

> *"Funciona rápido, no tuve que esperar cargas."* — U1

---

## Mejoras identificadas para próximo Sprint

| # | Problema | Impacto | Solución propuesta |
|---|----------|---------|-------------------|
| M1 | Botón "Nuevo hábito" difícil de encontrar en mobile | Medio | Agregar botón flotante (FAB) en esquina inferior derecha |
| M2 | Campo "confirmar contraseña" poco visible en registro | Bajo | Agregar ícono y placeholder más descriptivo |
| M3 | Botones Editar/Eliminar visualmente similares | Medio | Cambiar color del botón Editar a azul para diferenciarlo |
