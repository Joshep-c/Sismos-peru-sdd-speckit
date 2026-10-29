# Investigación: Actividad sísmica reciente

**Fecha**: 2026-10-29

## Decisión 1: Aplicación web

- **Decisión**: Usar React, Vite y TypeScript para una SPA; mantener datos y filtros en memoria.
- **Rationale**: La experiencia requerida se limita a una lista, controles de filtrado y un
  detalle que permanece en la misma página. No hay requisitos de cuentas, datos persistentes,
  servidor propio ni indexación pública que justifiquen una arquitectura más amplia.
- **Alternativas consideradas**: Una aplicación con backend y base de datos fue descartada
  porque no añade valor para el alcance aprobado. TypeScript sin framework queda como opción
  válida si el equipo decide reducir dependencias antes de implementar; React fue la preferencia
  confirmada por el usuario.

## Decisión 2: Consulta de eventos

- **Decisión**: Consumir el FDSN Event Web Service de USGS y solicitar GeoJSON para una ventana
  móvil de 30 días. Usar `starttime`, `endtime` y los límites geográficos rectangulares de la
  zona objetivo para reducir la respuesta; volver a filtrar los eventos en el cliente.
- **Rationale**: La documentación oficial ofrece consultas GeoJSON con parámetros de tiempo y
  rectángulo geográfico, y recomienda los feeds GeoJSON para casos automatizados cuando encajan.
  La consulta FDSN permite solicitar una ventana de 30 días y una región concreta en una sola
  llamada, incluyendo los campos de magnitud, lugar, tiempo, profundidad, coordenadas e
  identificador de fuente usados por la aplicación.
- **Alternativas consideradas**: Los feeds predefinidos (día, semana o mes) no expresan el
  rectángulo de la zona ni los periodos exactos de 24 horas y 7 días; no se usan como consulta
  principal. Un radio centrado en una ciudad no representa 200 km desde toda la frontera de Perú.
- **Validación pendiente de implementación**: Confirmar que el alojamiento permite solicitudes
  de navegador al endpoint USGS (CORS). Si no es así, introducir únicamente un proxy del mismo
  origen, sin cambiar el contrato cliente ni agregar credenciales al navegador.

## Decisión 3: Interpretación geográfica

- **Decisión**: Incluir un recurso GeoJSON estático de la frontera de Perú, derivado del conjunto
  Admin 0 de Natural Earth a escala 1:10m. Calcular una zona de 200 km con Turf, obtener su
  rectángulo envolvente para la consulta USGS y aceptar localmente solo los eventos dentro de la
  geometría resultante.
- **Rationale**: El rectángulo reduce el volumen de la respuesta, pero no define por sí mismo la
  frontera de cobertura. El filtro por polígono evita mostrar sismos fuera de Perú y del buffer.
  Natural Earth publica datos de países y Turf proporciona operaciones de buffer, bbox y
  punto-en-polígono.
- **Alternativas consideradas**: Usar solo la caja envolvente o un radio desde un punto central
  produce resultados fuera del alcance geográfico solicitado. Descargar geometría en cada carga
  añadiría otra dependencia de red; por eso el polígono se distribuye como recurso estático.
- **Riesgo**: La frontera del conjunto elegido es una representación cartográfica, no una
  determinación legal. Mantener el recurso y su atribución documentados y probar puntos dentro,
  fuera y sobre el límite del buffer.

## Decisión 4: Tiempo, filtros y niveles

- **Decisión**: Interpretar horas de USGS como instantes UTC y formatearlas para `America/Lima`.
  Aplicar los periodos como ventanas móviles de 24 horas, 7 días y 30 días. Aplicar periodo y
  magnitud mínima a la vez; ordenar por instante descendente y usar el identificador como
  desempate estable. Calcular los niveles con los umbrales de la especificación y mostrar el
  valor de magnitud con un decimal.
- **Rationale**: Mantiene una sola convención temporal en la consulta y presentación, permite
  resultados deterministas y conserva exactamente las reglas especificadas.
- **Alternativas consideradas**: Días calendario en hora local pueden variar según la hora de
  consulta y no corresponden a “últimas 24 horas”; por eso se usa una ventana móvil.

## Fuentes

- USGS, FDSN Event Web Service: https://earthquake.usgs.gov/fdsnws/event/1/
- USGS, Real-time GeoJSON Feeds: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
- Natural Earth, Admin 0 Countries 1:10m:
  https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/
- Turf, `buffer`: https://turfjs.org/docs/api/buffer
