# Contrato externo: USGS Earthquake GeoJSON

## Solicitud

Consumir el método `query` del FDSN Event Web Service:

`https://earthquake.usgs.gov/fdsnws/event/1/query`

Parámetros requeridos:

- `format=geojson`
- `starttime` y `endtime` en ISO 8601 UTC, que abarcan los últimos 30 días.
- `minlatitude`, `maxlatitude`, `minlongitude` y `maxlongitude` del rectángulo envolvente de la
  zona de cobertura.

La consulta debe solicitar una ventana completa de 30 días una sola vez; los periodos de 24
horas, 7 días y 30 días se filtran en la aplicación. La solicitud no lleva credenciales ni datos
personales. El cliente no debe asumir que el orden remoto satisface el orden de la interfaz.

## Respuesta consumida

Se espera un `FeatureCollection` GeoJSON. Para cada evento se usan:

- `id`: identificador estable.
- `properties.mag`: magnitud.
- `properties.place`: descripción del lugar.
- `properties.time`: instante UTC en milisegundos desde epoch.
- `properties.url`: enlace a la ficha del evento.
- `geometry.type`: debe ser `Point`.
- `geometry.coordinates`: longitud, latitud y profundidad en km.

`properties.detail`, `properties.status` y otros campos pueden existir, pero no son necesarios
para la experiencia definida.

## Normalización y errores

- Validar que la respuesta sea GeoJSON y que cada geometría usada sea un punto con coordenadas
  finitas y dentro de rangos geográficos válidos.
- Tratar `mag`, `place`, profundidad y URL como datos opcionales; no sustituirlos por datos
  inventados.
- Descartar elementos sin ID o posición válida y filtrar los puntos con el polígono bufferizado
  de Perú antes de presentarlos.
- En respuestas HTTP fallidas, JSON inválido o estructura incompatible, mostrar un mensaje
  comprensible y permitir reintentar. No mostrar el fallo como una lista vacía.
- Abrir `properties.url` como enlace externo identificable y seguro; omitir el enlace cuando
  no sea una URL válida.

## Referencias

- Descripción y parámetros del servicio: https://earthquake.usgs.gov/fdsnws/event/1/
- Estructura GeoJSON y campos: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
