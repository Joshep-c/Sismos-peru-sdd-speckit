# Tasks: Actividad sísmica reciente

**Input**: Design documents from `/specs/001-recent-earthquakes/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and core frontend scaffolding

- [ ] T001 Create the project structure per the implementation plan in `src/`, `src/app/`, `src/features/earthquakes/`, `public/data/`, and `tests/`
- [ ] T002 Initialize the React + Vite + TypeScript project and package manifest in `package.json` and `vite.config.ts`
- [ ] T003 [P] Configure ESLint, Vitest, Testing Library, and base styling in `package.json`, `vitest.config.ts`, and `src/styles/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared data, filter rules, and service contracts that all stories depend on

- [ ] T004 Create the Peru boundary dataset and attribution in `public/data/peru-boundary.geojson`
- [ ] T005 [P] Implement the geographic buffer and point-in-polygon helpers in `src/features/earthquakes/model/geography.ts`
- [ ] T006 [P] Define the normalized earthquake model and validation rules in `src/features/earthquakes/model/earthquake.ts`
- [ ] T007 Define the query state model, period options, and minimum magnitude values in `src/features/earthquakes/model/query-state.ts`
- [ ] T008 Implement the USGS GeoJSON fetch, validation, and normalization flow in `src/features/earthquakes/api/usgs-client.ts`
- [ ] T009 Implement severity classification and magnitude formatting rules in `src/features/earthquakes/model/severity.ts`
- [ ] T010 Create shared loading, error, and empty-state handlers for fetch results in `src/features/earthquakes/components/StatusMessage.tsx`

**Checkpoint**: The foundation is ready; user story work can start in parallel.

---

## Phase 3: User Story 1 - Consultar sismos recientes (Priority: P1) 🎯 MVP

**Goal**: Mostrar la lista de sismos recientes de Perú y sus alrededores, ordenada y legible sin login.

**Independent Test**: Con datos disponibles, la persona abre la aplicación y reconoce la lista principal, el orden reciente, la ubicación, la hora local y la profundidad sin configuración adicional.

### Tests for User Story 1

- [ ] T011 [P] [US1] Add unit tests for sorting and UTC-to-Lima formatting in `tests/unit/earthquake-order.test.ts`
- [ ] T012 [P] [US1] Add component tests for the main list, loading state, and error state in `tests/components/earthquake-list.test.tsx`

### Implementation for User Story 1

- [ ] T013 [P] [US1] Build the earthquake list view and card rendering in `src/features/earthquakes/components/EarthquakeList.tsx`
- [ ] T014 [P] [US1] Create the initial fetch and render orchestration in `src/app/App.tsx`
- [ ] T015 [US1] Connect the USGS response to the model and apply the 200 km Peru coverage filter in `src/features/earthquakes/api/usgs-client.ts` and `src/features/earthquakes/model/geography.ts`
- [ ] T016 [US1] Show the informational message that the data is informative and not a substitute for official sources in `src/app/App.tsx`
- [ ] T017 [US1] Ensure optional fields such as `place`, `depthKm`, and `sourceUrl` render as honest fallbacks without inventing values in `src/features/earthquakes/components/EarthquakeList.tsx`

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Filtrar la actividad sísmica (Priority: P2)

**Goal**: Permitir filtrar por periodo y magnitud mínima, aplicando ambos criterios a la vez.

**Independent Test**: Con eventos de distintas fechas y magnitudes, la persona cambia el periodo y la magnitud mínima y valida que solo quedan los eventos que cumplen ambos filtros.

### Tests for User Story 2

- [ ] T018 [P] [US2] Add unit tests for 24h, 7d, 30d windows and minimum magnitude combinations in `tests/unit/filtering.test.ts`
- [ ] T019 [P] [US2] Add component tests for filter controls and empty-state messaging in `tests/components/filter-panel.test.tsx`

### Implementation for User Story 2

- [ ] T020 [P] [US2] Implement the filter logic and state transitions in `src/features/earthquakes/model/query-state.ts`
- [ ] T021 [P] [US2] Create the period and minimum magnitude controls in `src/features/earthquakes/components/FilterPanel.tsx`
- [ ] T022 [US2] Wire the filter controls to data refresh and keep the selected values when returning from detail in `src/app/App.tsx`
- [ ] T023 [US2] Render a clear no-results message with the controls still available in `src/features/earthquakes/components/EmptyState.tsx`

**Checkpoint**: User Story 2 is independently testable without other stories.

---

## Phase 5: User Story 3 - Entender el nivel de un sismo (Priority: P3)

**Goal**: Clasificar cada evento como leve, moderado o fuerte con texto y color explícitos.

**Independent Test**: Con magnitudes debajo de 4.0, entre 4.0 y 5.9 y desde 6.0, la persona identifica el nivel correcto tanto por texto como por color/etiqueta.

### Tests for User Story 3

- [ ] T024 [P] [US3] Add tests for the 4.0 and 6.0 thresholds and text labels in `tests/unit/severity.test.ts`
- [ ] T025 [P] [US3] Add accessibility-focused tests for the severity label text in `tests/components/severity-label.test.tsx`

### Implementation for User Story 3

- [ ] T026 [P] [US3] Implement the `leve`, `moderado`, and `fuerte` classification in `src/features/earthquakes/model/severity.ts`
- [ ] T027 [US3] Surface the severity badge and text in the list and detail views in `src/features/earthquakes/components/EarthquakeCard.tsx` and `src/features/earthquakes/components/EarthquakeDetail.tsx`
- [ ] T028 [US3] Ensure the color cue is paired with text and that focus/contrast remain accessible in `src/styles/theme.css` and the component markup

**Checkpoint**: User Story 3 works independently and remains understandable without color alone.

---

## Phase 6: User Story 4 - Consultar el detalle y la fuente (Priority: P4)

**Goal**: Abrir el detalle del sismo con datos amplios y un enlace identificable a la fuente.

**Independent Test**: Desde la lista, la persona abre un detalle, revisa magnitud, profundidad, coordenadas, hora local y enlace a la fuente, y regresa sin perder los filtros actuales.

### Tests for User Story 4

- [ ] T029 [P] [US4] Add tests for detail rendering, optional source URL, and return-to-list behavior in `tests/components/earthquake-detail.test.tsx`

### Implementation for User Story 4

- [ ] T030 [P] [US4] Create the detail panel for magnitude, depth, coordinates, time, and source link in `src/features/earthquakes/components/EarthquakeDetail.tsx`
- [ ] T031 [US4] Add safe external link handling and optional field display in `src/features/earthquakes/components/SourceLink.tsx`
- [ ] T032 [US4] Connect the list-item navigation and restore the selected filter state when returning in `src/app/App.tsx`
- [ ] T033 [US4] Add source attribution and a clear fallback when the URL is not available in `src/features/earthquakes/components/EarthquakeDetail.tsx`

**Checkpoint**: User Story 4 is independently testable and can be delivered after the core list and filters are stable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, quality, and final verification across all stories

- [ ] T034 [P] Run the Vitest suite and fix regressions across `tests/unit/` and `tests/components/`
- [ ] T035 [P] Review keyboard navigation, visible focus, and screen-reader names across the earthquake views in `src/features/earthquakes/components/` and `src/styles/`
- [ ] T036 [P] Optimize the normalization and filtering flow for larger result sets in `src/features/earthquakes/model/` and `src/features/earthquakes/api/`
- [ ] T037 Validate the manual QA checklist from `specs/001-recent-earthquakes/quickstart.md` and confirm the required test scenarios pass
- [ ] T038 Perform final cleanup of the component structure and documentation references in `src/` and `README.md`

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Blocks all user stories and must finish before story work begins.
- **User stories (Phases 3-6)**: Can proceed in priority order, but each story remains independently testable after its phase is complete.
- **Polish (Phase 7)**: Must wait until all selected user stories are complete.

### User story dependencies

- **US1 (P1)**: No dependency on other stories; it delivers the MVP.
- **US2 (P2)**: Depends on the query model and list infrastructure from US1 but stays functionally independent.
- **US3 (P3)**: Depends on the shared earthquake model and list rendering from US1; can be implemented alongside US2 if needed.
- **US4 (P4)**: Depends on the list and filter state from US1 and US2; adds detail behavior without changing the base query model.

### Parallel opportunities

- Setup tasks T001-T003 can be pursued in parallel.
- Foundational tasks T004-T010 can be split across geography, model, and API work in parallel.
- Tests within each story are parallelizable and independent of the implementation work in the same story.
- Story work can be parallelized by different contributors once the foundation is done.

---

## Parallel Example: User Story 1

```bash
# Run list & order tests together
Task: "Add unit tests for sorting and UTC-to-Lima formatting in tests/unit/earthquake-order.test.ts"
Task: "Add component tests for the main list, loading state, and error state in tests/components/earthquake-list.test.tsx"

# Run model setup tasks together
Task: "Build the earthquake list view and card rendering in src/features/earthquakes/components/EarthquakeList.tsx"
Task: "Create the initial fetch and render orchestration in src/app/App.tsx"
```

---

## Implementation Strategy

### MVP first

1. Complete Phase 1 and Phase 2.
2. Deliver US1 end to end: fetch, filter by geography, list, sort, and honest display of data.
3. Add US2 for filtering and empty/error states.
4. Add US3 for severity classification.
5. Add US4 for detail and source link.
6. Finish with Phase 7 polish and manual validation.

### Incremental delivery

- The data model, geography utilities, API client, and query-state logic are all independent building blocks.
- The app can be validated after each story without requiring the full product to be complete.
- The feature remains scoped to a single SPA with no backend or persisted state.

This implementation plan matches the design in `plan.md`, the user stories in `spec.md`, the entities in `data-model.md`, and the contract in `contracts/usgs-earthquake.md`.
