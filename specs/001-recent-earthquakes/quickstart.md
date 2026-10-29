# Guía rápida de validación

## Prerrequisitos

- Node.js y npm instalados.
- Acceso a Internet para consultar USGS.

## Ejecutar localmente

Desde la raíz del proyecto:

```powershell
npm install
npm run dev
```

Abre la URL local indicada por Vite. La lista debe cargar sin cuenta y mostrar los eventos
disponibles de Perú y su zona de 200 km. El tiempo debe mostrarse en hora de Perú y el aviso
informativo debe indicar que la aplicación no reemplaza a las autoridades oficiales.

## Validar reglas y estados

```powershell
npm test
npm run build
```

Las pruebas deben cubrir:

1. Ventanas móviles de 24 horas, 7 días y 30 días, incluido el instante límite.
2. Filtro mínimo de magnitud combinado con el periodo; magnitudes ausentes solo aparecen con
   “Todas”.
3. Clasificación en los límites 4.0 y 6.0; valor visible con un decimal.
4. Inclusión de puntos dentro de Perú y dentro del buffer de 200 km; exclusión de puntos fuera
   de la geometría, con inclusión de puntos exactamente en su límite.
5. Orden descendente y desempate estable para eventos con igual instante.
6. Mensaje de lista vacía, mensaje de error con reintento y presentación honesta de campos
   ausentes.
7. Retorno desde detalle a lista conservando periodo y magnitud mínima.

Con la aplicación abierta, cambia ambos filtros y confirma que se aplican simultáneamente.
Abre un evento, verifica magnitud, profundidad, coordenadas, hora local y enlace USGS cuando
exista; regresa y comprueba que los filtros continúan seleccionados. Repite con una respuesta
sin resultados y simulando una falla de red. Comprueba los controles y el reintento solo con
teclado, con foco visible y texto de nivel comprensible sin depender del color.
