# Implementation Plan: Actividad sísmica reciente

**Branch**: `001-recent-earthquakes` | **Date**: 2026-10-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-recent-earthquakes/spec.md`

## Summary

Crear una aplicación web pública y adaptable que consulta eventos de los últimos 30 días en
USGS, restringe los resultados a Perú y su zona de 200 km, y permite ordenarlos, filtrarlos y
abrir su detalle. La solución será una SPA con React, Vite y TypeScript; mantendrá los datos en
memoria, consumirá GeoJSON de USGS y aplicará el límite geográfico con un polígono local de
Perú. No incluirá cuentas, mapas, alertas ni backend propio.

## Technical Context

**Language/Version**: TypeScript; versión fijada al iniciar la implementación.  
**Primary Dependencies**: React, Vite, `@turf/buffer`, `@turf/bbox`,
`@turf/boolean-point-in-polygon`; Vitest y React Testing Library para pruebas.  
**Storage**: Sin persistencia de eventos; estado de consulta en memoria. Polígono de Perú como
recurso GeoJSON estático.  
**Testing**: Vitest y React Testing Library; pruebas unitarias de normalización, cobertura,
filtros, orden y niveles; pruebas de componentes para estados y navegación; revisión manual de
teclado y foco.  
**Target Platform**: Navegadores modernos de escritorio y móviles.  
**Project Type**: Aplicación web SPA.  
**Performance Goals**: Mostrar la lista en menos de 5 segundos en al menos el 95% de consultas
con datos disponibles, según SC-002.  
**Constraints**: Una consulta por los últimos 30 días; los filtros de periodo y magnitud se
aplican simultáneamente; zona horaria `America/Lima`; sin autenticación; comunicar fallos de
red y permitir reintentar; sin alertas ni predicciones.  
**Scale/Scope**: Una vista de consulta con filtros y detalle en la misma página; únicamente
eventos de Perú y el área de 200 km definida en la especificación.

## Constitution Check

| Principio / gate | Resultado | Aplicación al diseño |
|---|---|---|
| I. Código simple y legible | PASS | SPA pequeña, funciones puras para reglas y ninguna capa de backend innecesaria. |
| II. Alcance mínimo viable | PASS | Solo lista, filtros, detalle, estados de carga/error y aviso informativo; sin mapa, cuentas o alertas. |
| III. Reglas de negocio verificables | PASS | Pruebas automatizadas para periodo, magnitud, zona geográfica, orden y límites de clasificación. |
| IV. Errores claros para el usuario | PASS | Estados diferenciados de carga, error con reintento, lista vacía y campos opcionales no disponibles. |
| V. Interfaz accesible | PASS | Controles semánticos, uso por teclado, foco visible, nivel comunicado con texto además de color y pruebas/revisión de accesibilidad. |
| Seguridad, privacidad y compatibilidad | PASS | Sin cuentas ni datos personales; validar y normalizar la respuesta externa y abrir enlaces de fuente de forma segura. |

No se identifican violaciones que requieran justificación. La selección de proveedor y tecnología
en este plan concreta el alcance de la especificación, sin cambiar sus requisitos funcionales.

## Project Structure

### Documentation (this feature)

```text
specs/001-recent-earthquakes/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── usgs-earthquake.md
```

### Source Code (repository root)

```text
src/
├── app/
├── features/earthquakes/
│   ├── api/
│   ├── components/
│   └── model/
└── styles/

public/data/
└── peru-boundary.geojson

tests/
├── unit/
└── components/
```

**Structure Decision**: Aplicación React/Vite en `src/`; la funcionalidad sísmica agrupa la
consulta, el modelo y los componentes bajo `src/features/earthquakes/`. El límite geográfico
estático se sirve desde `public/data/`. Las pruebas separan reglas puras de comportamiento de
componentes. No se crea un backend ni una API pública porque la especificación no los requiere.

## Complexity Tracking

No hay violaciones de la constitución ni complejidad adicional que justificar.

## Post-Design Constitution Check

PASS. Los artefactos de diseño mantienen el alcance mínimo, identifican pruebas para todas las
reglas de negocio, contemplan errores visibles y describen requisitos de accesibilidad. No se
añadieron servicios, persistencia o interfaces públicas innecesarias.
