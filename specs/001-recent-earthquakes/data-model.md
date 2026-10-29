# Modelo de datos: Actividad sísmica reciente

## Sismo

Evento normalizado desde un elemento GeoJSON de USGS.

| Campo | Tipo | Regla |
|---|---|---|
| `id` | string | Identificador requerido del evento; se usa como clave estable. |
| `magnitude` | number o null | Magnitud original de USGS. Si falta, no se inventa un valor; no puede satisfacer un filtro mínimo numérico. |
| `place` | string o null | Descripción de ubicación proporcionada por USGS. Mostrar “No disponible” si falta. |
| `occurredAt` | instante o null | Milisegundos desde epoch en la fuente; convertir a fecha/hora local `America/Lima`. Un evento sin instante válido no puede incluirse en periodos ni ordenarse y se descarta de la lista. |
| `depthKm` | number o null | Coordenada Z GeoJSON; indicar cuando no esté disponible. |
| `longitude` | number | Primera coordenada GeoJSON; necesaria para determinar cobertura. |
| `latitude` | number | Segunda coordenada GeoJSON; necesaria para determinar cobertura. |
| `sourceUrl` | URL o null | Enlace `properties.url`; si falta, el detalle no presenta un enlace inventado. |
| `severity` | `leve`, `moderado`, `fuerte` o null | Valor calculado desde la magnitud disponible: `< 4.0`, `4.0–< 6.0`, `>= 6.0`. |

Se descartan elementos sin identificador o coordenadas válidas y puntos fuera del polígono
bufferizado. Los demás campos opcionales permanecen nulos. La lista muestra magnitud y hora
formateadas con un decimal y en hora de Perú, respectivamente.

## Filtro de consulta

Estado de la consulta controlado por la interfaz:

| Campo | Tipo | Regla |
|---|---|---|
| `period` | `24h`, `7d`, `30d` | Ventana móvil hacia atrás desde el instante actual; valor inicial `7d`. |
| `minimumMagnitude` | `all`, `3.0`, `4.0`, `5.0` | Valor inicial `all`; un evento sin magnitud solo permanece en `all`. |

Los dos criterios se combinan con AND. La lista se ordena desde el evento más reciente; cuando
dos eventos comparten instante, se ordenan por `id` para conservar un resultado estable.
Cambiar de lista a detalle y regresar mantiene este estado.

## Zona de cobertura

- Geometría base: polígono GeoJSON estático de Perú.
- Geometría de consulta: buffer de 200 km alrededor del polígono base.
- Consulta remota: rectángulo envolvente del buffer.
- Inclusión final: el punto del evento debe caer en el buffer; puntos en el límite se consideran
  dentro.

## Estado de interfaz

La consulta tiene estados explícitos `loading`, `success`, `empty` y `error`. `empty` significa
que la carga terminó y no hay resultados para los filtros actuales; `error` significa que no
se pudieron obtener o interpretar los datos. El estado de error conserva los filtros y ofrece
una acción de reintento.
