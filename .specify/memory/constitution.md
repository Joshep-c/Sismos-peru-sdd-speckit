<!--
Sync Impact Report
- Version change: unversioned scaffold -> 1.0.0
- Modified principles: none; five principles established from the project input
- Added sections: Alcance y restricciones; Flujo de calidad
- Removed sections: none
- Follow-up items: none
-->

# Sismos Peru Constitution

## Core Principles

### I. Codigo simple y legible
El codigo MUST usar estructuras y nombres claros, mantener funciones y modulos pequenos cuando
sea razonable, y evitar abstracciones sin una necesidad demostrable. Cada cambio MUST poder
explicarse con su comportamiento observable y su motivo.

### II. Alcance minimo viable
Cada funcionalidad MUST limitarse al alcance necesario para cumplir el objetivo aprobado del MVP.
El equipo MUST posponer capacidades, configuraciones y generalizaciones que no sean necesarias
para ese objetivo, y MUST justificar por escrito cualquier aumento de alcance.

### III. Reglas de negocio verificables
Cada regla de negocio MUST tener al menos una prueba automatizada que verifique su resultado
esperado y sus casos limite relevantes. Los cambios en reglas de negocio MUST actualizar o
agregar esas pruebas antes de considerarse terminados.

### IV. Errores claros para el usuario
Los errores visibles para el usuario MUST explicar que ocurrio y, cuando sea posible, indicar
como continuar. Los mensajes MUST evitar detalles tecnicos innecesarios, no MUST exponer secretos
ni datos sensibles, y las pruebas MUST cubrir los errores relevantes del flujo.

### V. Interfaz accesible
Toda interfaz MUST mantener contraste suficiente, foco visible y operabilidad mediante teclado
cuando aplique. Los componentes y estados interactivos MUST conservar nombres y mensajes
comprensibles para tecnologias de asistencia. Las pruebas o revisiones de interfaz MUST comprobar
estos requisitos en cada flujo afectado.

## Alcance y restricciones

La constitucion gobierna el trabajo del proyecto sin imponer una tecnologia no requerida. La
seguridad, la privacidad y la compatibilidad con las interfaces existentes MUST conservarse salvo
que el cambio aprobado documente el impacto y la migracion necesaria.

## Flujo de calidad

Cada cambio MUST incluir una verificacion proporcional al riesgo: pruebas automatizadas para
logica y reglas de negocio, y una comprobacion de accesibilidad para interfaces modificadas.
Antes de integrarse, el cambio MUST pasar las comprobaciones disponibles y una revision que
confirme el alcance minimo, la claridad de los errores y el cumplimiento de estos principios.

## Governance

Esta constitucion prevalece sobre practicas conflictivas del proyecto. Toda enmienda MUST
documentar el motivo, el impacto y cualquier trabajo de migracion. La version usa SemVer:
MAJOR para eliminar o redefinir de forma incompatible un principio o regla; MINOR para agregar o
ampliar materialmente un principio o seccion; PATCH para aclaraciones y correcciones sin cambio
semantico. Las revisiones de cambios MUST comprobar el cumplimiento de la constitucion y registrar
cualquier excepcion con su justificacion y fecha de vencimiento. La revision de cumplimiento MUST
realizarse al crear o actualizar una especificacion, un plan y las tareas de una funcionalidad.

**Version**: 1.0.0 | **Ratified**: 2026-10-28 | **Last Amended**: 2026-10-28
