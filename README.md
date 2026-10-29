# Sismos Perú - Actividad Sísmica Reciente

Aplicación web pública, moderna y accesible para la consulta en tiempo real de sismos recientes ocurridos en Perú y hasta 200 km de sus fronteras, basada en datos del catálogo sísmico oficial de USGS.

Desarrollada bajo la metodología **Spec-Driven Development (SDD)** con Spec Kit.

---

## Características

- **Consulta sin autenticación (US1)**: Acceso libre e inmediato sin necesidad de registro ni credenciales.
- **Cobertura geográfica de 200 km**: Polígono oficial simplificado de Perú con cálculo de zona buffer de 200 km mediante Turf.js.
- **Orden cronológico y hora local**: Sismos ordenados del más reciente al más antiguo, con fecha y hora local convertida a `America/Lima` (UTC-5).
- **Filtros combinados simultáneos (US2)**:
  - Periodos móviles: últimas 24 horas, 7 días (por defecto) y 30 días.
  - Magnitud mínima: Todas (por defecto), ≥ 3.0, ≥ 4.0, ≥ 5.0.
- **Nivel de gravedad visual y textual (US3)**:
  - **Leve**: Magnitud < 4.0 (verde accesible).
  - **Moderado**: Magnitud 4.0 – < 6.0 (ámbar accesible).
  - **Fuerte**: Magnitud ≥ 6.0 (rojo accesible).
  - Totalmente comprensible por texto sin depender exclusivamente del color.
- **Detalle completo y enlace a la fuente (US4)**:
  - Magnitud con un decimal, profundidad en km, coordenadas geográficas y hora local.
  - Enlace seguro hacia la ficha técnica del evento en USGS (`target="_blank"`, `rel="noopener noreferrer"`).
  - Retorno a la lista preservando intacto el estado de los filtros seleccionados.
- **Aviso informativo**: Mensaje visible que recuerda el carácter informativo de la app y la referencia a las autoridades oficiales (IGP, INDECI, DHN).
- **Accesibilidad integral**: Navegación por teclado, foco visible, roles ARIA y contrastes verificados.

---

## Tecnologías

- **Framework**: React 19 + TypeScript + Vite 6
- **Geometría espacial**: `@turf/buffer`, `@turf/bbox`, `@turf/boolean-point-in-polygon`, `@turf/helpers`
- **Estilos**: Vanilla CSS con variables de diseño, modo oscuro contemporáneo y microinteracciones
- **Pruebas**: Vitest, React Testing Library, jsdom
- **Calidad de código**: ESLint 9 (flat config)

---

## Instalación y ejecución

### Prerrequisitos
- Node.js >= 18
- npm >= 9

### Comandos principales

```powershell
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo local
npm run dev

# 3. Ejecutar suite de pruebas unitarias y de componentes
npm test

# 4. Validar linter
npm run lint

# 5. Compilar bundle de producción
npm run build
```

---

## Especificaciones y Documentación

- [Especificación funcional](specs/001-recent-earthquakes/spec.md)
- [Plan de implementación](specs/001-recent-earthquakes/plan.md)
- [Tareas de desarrollo](specs/001-recent-earthquakes/tasks.md)
- [Modelo de datos](specs/001-recent-earthquakes/data-model.md)
- [Contrato externo USGS](specs/001-recent-earthquakes/contracts/usgs-earthquake.md)
- [Guía de validación rápida](specs/001-recent-earthquakes/quickstart.md)
