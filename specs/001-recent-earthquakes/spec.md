# Feature Specification: Actividad sísmica reciente

**Feature Branch**: `001-recent-earthquakes`

**Created**: 2026-10-28

**Status**: Draft

**Input**: User description: "Quiero una aplicación web que muestre los sismos recientes ocurridos en Perú y sus alrededores, de forma clara y fácil de filtrar, para que cualquier persona pueda consultar rápidamente la actividad sísmica reciente."

## Clarifications

### Session 2026-10-28

- Q: ¿Qué alcance geográfico debe tener “Perú y sus alrededores”? → A: Perú y un radio de 200 km desde sus fronteras.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar sismos recientes (Priority: P1)

Como persona del público general o estudiante, quiero ver los sismos recientes de Peru y sus
alrededores ordenados del mas reciente al mas antiguo, con magnitud, lugar, fecha y hora local,
y profundidad, para enterarme rapidamente de lo ocurrido.

**Why this priority**: La lista es el valor principal de la aplicacion y permite consultar la
actividad sin conocimientos tecnicos ni cuenta de usuario.

**Independent Test**: Con datos sismicos disponibles, una persona puede abrir la aplicacion y
reconocer los eventos recientes, su magnitud, ubicacion, momento y profundidad sin realizar otra
configuracion.

**Acceptance Scenarios**:

1. **Given** que existen sismos recientes disponibles, **When** la persona abre la aplicacion,
   **Then** ve una lista ordenada del mas reciente al mas antiguo.
2. **Given** que la lista contiene sismos, **When** la persona revisa un elemento,
   **Then** encuentra magnitud con un decimal, lugar, fecha y hora local de Peru y profundidad.
3. **Given** que no es necesario crear una cuenta, **When** una persona visita la aplicacion,
   **Then** puede consultar la lista directamente.

---

### User Story 2 - Filtrar la actividad sísmica (Priority: P2)

Como persona interesada en un periodo o intensidad concretos, quiero filtrar los sismos por
ultimas 24 horas, 7 dias o 30 dias, y por magnitud minima, para ver solo la actividad que me
interesa.

**Why this priority**: Los filtros reducen el esfuerzo de lectura y permiten responder preguntas
concretas sin ampliar el alcance de la consulta.

**Independent Test**: Con una lista que contenga eventos de distintas fechas y magnitudes, la
persona selecciona un periodo y una magnitud minima y confirma que solo permanecen los eventos
que cumplen ambos filtros.

**Acceptance Scenarios**:

1. **Given** que hay sismos en distintos periodos, **When** la persona selecciona 24 horas,
   7 dias o 30 dias, **Then** la lista muestra solo los eventos del periodo seleccionado.
2. **Given** que hay sismos con distintas magnitudes, **When** la persona selecciona una
   magnitud minima, **Then** la lista muestra solo eventos con magnitud igual o superior.
3. **Given** que la combinacion de filtros no coincide con ningun evento, **When** se aplican
   los filtros, **Then** se muestra un mensaje claro en lugar de una lista vacia.

---

### User Story 3 - Entender el nivel de un sismo (Priority: P3)

Como persona que no necesariamente conoce la escala sismica, quiero que cada sismo muestre si es
leve, moderado o fuerte mediante color y texto, para distinguir su gravedad de un vistazo.

**Why this priority**: La clasificacion convierte la magnitud en una señal comprensible, sin
reemplazar el valor numerico ni exigir conocimientos especializados.

**Independent Test**: Con eventos de magnitudes por debajo de 4.0, entre 4.0 y 5.9 y desde 6.0,
la persona identifica visualmente y mediante texto las tres clasificaciones correctas.

**Acceptance Scenarios**:

1. **Given** un sismo con magnitud menor a 4.0, **When** se muestra el evento,
   **Then** aparece como leve con color y texto.
2. **Given** un sismo con magnitud de 4.0 a 5.9, **When** se muestra el evento,
   **Then** aparece como moderado con color y texto.
3. **Given** un sismo con magnitud desde 6.0, **When** se muestra el evento,
   **Then** aparece como fuerte con color y texto.
4. **Given** una persona que no distingue los colores, **When** revisa un evento,
   **Then** el nivel tambien se entiende por el texto y no depende solo del color.

---

### User Story 4 - Consultar el detalle y la fuente (Priority: P4)

Como persona que necesita ampliar la informacion de un sismo, quiero abrir su detalle con
magnitud, profundidad, coordenadas, hora y un enlace a la fuente, para verificar y comprender
mejor el evento.

**Why this priority**: El detalle aporta contexto y transparencia despues de la consulta rapida,
sin convertir la aplicacion en un portal tecnico completo.

**Independent Test**: Desde un evento de la lista, la persona abre su detalle, encuentra todos los
campos indicados y puede seguir el enlace de la fuente.

**Acceptance Scenarios**:

1. **Given** un sismo visible en la lista, **When** la persona abre el evento,
   **Then** ve magnitud, profundidad, coordenadas y hora local de Peru.
2. **Given** que el evento tiene una fuente disponible, **When** la persona revisa el detalle,
   **Then** encuentra un enlace identificable para consultar la fuente.
3. **Given** que la persona termina de revisar el detalle, **When** vuelve a la consulta,
   **Then** puede regresar a la lista sin perder los filtros aplicados.

---

### Edge Cases

- Cuando no hay datos para el periodo seleccionado, la aplicacion muestra un mensaje claro y
  conserva los controles para cambiar los filtros.
- Cuando los datos no pueden obtenerse, la aplicacion informa del problema en lenguaje claro y
  ofrece una accion para reintentar.
- Cuando un dato opcional de un evento no esta disponible, la aplicacion lo indica sin inventar
  un valor y mantiene visibles los datos disponibles.
- Cuando dos eventos tienen la misma hora, la lista mantiene un orden estable y comprensible.
- Cuando una magnitud esta justo en 4.0 o 6.0, se aplica el nivel moderado o fuerte,
  respectivamente.
- Cuando la vista se usa con teclado o tecnologia de asistencia, los controles, niveles, mensajes
  y detalles siguen siendo comprensibles y operables.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La aplicacion MUST permitir a cualquier persona consultar la actividad sismica
  reciente sin crear una cuenta.
- **FR-002**: La aplicacion MUST mostrar sismos ocurridos en Peru y dentro de un radio de 200 km
  desde sus fronteras, dentro del periodo consultable.
- **FR-003**: La aplicacion MUST ordenar los sismos de la lista del mas reciente al mas antiguo.
- **FR-004**: Cada elemento de la lista MUST mostrar magnitud, lugar, fecha, hora local de Peru
  y profundidad cuando esos datos esten disponibles.
- **FR-005**: La aplicacion MUST mostrar las magnitudes con un decimal.
- **FR-006**: La aplicacion MUST permitir filtrar por ultimas 24 horas, 7 dias y 30 dias.
- **FR-007**: La aplicacion MUST permitir filtrar por magnitud minima.
- **FR-008**: La aplicacion MUST aplicar simultaneamente el periodo y la magnitud minima
  seleccionados.
- **FR-009**: La aplicacion MUST mostrar un mensaje claro cuando ningun sismo cumpla los filtros.
- **FR-010**: La aplicacion MUST clasificar cada sismo como leve si su magnitud es menor a 4.0,
  moderado si esta entre 4.0 y 5.9, y fuerte si es desde 6.0.
- **FR-011**: La aplicacion MUST comunicar cada nivel mediante texto y una señal de color
  distinguible, sin depender exclusivamente del color.
- **FR-012**: La aplicacion MUST permitir abrir el detalle de un sismo desde la lista.
- **FR-013**: El detalle MUST mostrar magnitud, profundidad, coordenadas y hora local de Peru,
  junto con un enlace identificable a la fuente cuando este disponible.
- **FR-014**: La aplicacion MUST informar claramente cuando no pueda obtener los datos y MUST
  ofrecer una accion para reintentar.
- **FR-015**: La aplicacion MUST indicar de forma visible que la informacion es informativa y no
  reemplaza las fuentes oficiales de las autoridades.
- **FR-016**: La aplicacion MUST mantener contraste suficiente, foco visible, nombres comprensibles
  y operabilidad mediante teclado para sus controles y detalles interactivos.
- **FR-017**: La aplicacion MUST conservar los filtros seleccionados cuando la persona regrese del
  detalle a la lista.
- **FR-018**: La aplicacion MUST evitar presentar como reales los valores que no esten disponibles
  en la fuente de datos.

### Key Entities *(include if feature involves data)*

- **Sismo**: Evento sismico reciente con magnitud, lugar, fecha y hora, profundidad, coordenadas,
  nivel calculado y referencia a su fuente.
- **Filtro de consulta**: Seleccion del periodo y magnitud minima que determina los eventos visibles.
- **Fuente de informacion**: Referencia que permite consultar el origen oficial o responsable de
  los datos de un sismo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En condiciones normales, al menos el 95% de las personas puede identificar el sismo
  mas reciente, su magnitud y su lugar en menos de 10 segundos desde que abre la aplicacion.
- **SC-002**: La lista inicial de sismos queda visible y actualizada en un maximo de 5 segundos en
  al menos el 95% de las consultas con datos disponibles.
- **SC-003**: Al menos el 90% de las personas puede aplicar un periodo y una magnitud minima y
  reconocer el resultado filtrado en menos de 30 segundos.
- **SC-004**: En una evaluacion con eventos de las tres categorias, al menos el 95% de las personas
  identifica correctamente los sismos fuertes sin depender exclusivamente del valor numerico.
- **SC-005**: El 100% de las consultas sin resultados muestra un mensaje explicativo y una forma
  visible de cambiar los filtros.
- **SC-006**: El 100% de los estados de fallo de obtencion de datos muestra un mensaje comprensible
  y una accion para reintentar.
- **SC-007**: En una revision de accesibilidad de los flujos principales, todos los controles de
  filtro, lista, detalle y reintento tienen foco visible, nombre comprensible y operacion mediante
  teclado.

## Assumptions

- La aplicacion tendra acceso a una fuente de informacion sismica reciente y con referencias a
  los eventos mostrados.
- La fuente proporciona fecha y hora suficientes para presentar los eventos en la hora local de
  Peru, o permite realizar esa conversion sin alterar el momento del evento.
- La cobertura de "Peru y sus alrededores" se interpreta como Peru y un radio de 200 km desde sus
  fronteras.
- Al abrir la aplicacion, el periodo seleccionado por defecto es de 7 dias y la magnitud minima
  seleccionada por defecto es "todas".
- Las opciones disponibles para la magnitud minima son 3.0, 4.0 y 5.0, ademas de "todas".
- El detalle de un sismo se abre en la misma pagina y conserva los filtros seleccionados.
- La aplicacion muestra un indicador de carga mientras obtiene los datos.
- La informacion se presenta como consulta informativa; las alertas, predicciones y decisiones de
  seguridad quedan fuera de alcance.
- Las fuentes oficiales de las autoridades siguen siendo la referencia para informacion operativa
  o de emergencia.
- La experiencia debe funcionar para personas que usan pantallas grandes o pequenas y para
  quienes navegan con teclado o tecnologia de asistencia.
