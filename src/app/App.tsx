import React, { useEffect, useState, useCallback, useMemo } from 'react';
import peruBoundaryData from '../../public/data/peru-boundary.geojson';
import { createCoverageBuffer, CoveragePolygon } from '../features/earthquakes/model/geography';
import { fetchRecentEarthquakes } from '../features/earthquakes/api/usgs-client';
import { Earthquake } from '../features/earthquakes/model/earthquake';
import {
  QueryFilterState,
  DEFAULT_QUERY_STATE,
  filterEarthquakes,
  PeriodOption,
  MinimumMagnitudeOption,
} from '../features/earthquakes/model/query-state';
import { EarthquakeList } from '../features/earthquakes/components/EarthquakeList';
import { EarthquakeDetail } from '../features/earthquakes/components/EarthquakeDetail';
import { FilterPanel } from '../features/earthquakes/components/FilterPanel';
import { EmptyState } from '../features/earthquakes/components/EmptyState';
import { StatusMessage } from '../features/earthquakes/components/StatusMessage';

export const App: React.FC = () => {
  const [allEarthquakes, setAllEarthquakes] = useState<Earthquake[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filters, setFilters] = useState<QueryFilterState>(DEFAULT_QUERY_STATE);
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);

  // Memoize coverage polygon with 200 km buffer
  const coverageGeometry = useMemo<CoveragePolygon>(() => {
    return createCoverageBuffer(peruBoundaryData, 200);
  }, []);

  const loadData = useCallback(async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const data = await fetchRecentEarthquakes(coverageGeometry);
      setAllEarthquakes(data);
      setStatus('success');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo obtener la información sísmica. Por favor verifique su conexión e intente nuevamente.';
      setErrorMessage(message);
      setStatus('error');
    }
  }, [coverageGeometry]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePeriodChange = (period: PeriodOption) => {
    setFilters((prev) => ({ ...prev, period }));
  };

  const handleMagnitudeChange = (minimumMagnitude: MinimumMagnitudeOption) => {
    setFilters((prev) => ({ ...prev, minimumMagnitude }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_QUERY_STATE);
  };

  const handleSelectEarthquake = (earthquake: Earthquake) => {
    setSelectedEarthquake(earthquake);
  };

  const handleBackToList = () => {
    setSelectedEarthquake(null);
  };

  // Apply filters simultaneously (FR-008)
  const filteredEarthquakes = useMemo(() => {
    return filterEarthquakes(allEarthquakes, filters);
  }, [allEarthquakes, filters]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-title-row">
          <h1 className="app-title">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 12h5l3-8 4 16 3-8h5" />
            </svg>
            Sismos Perú
          </h1>
          <span className="live-badge" aria-label="Monitoreo activo">
            <span className="live-pulse" aria-hidden="true" />
            En vivo
          </span>
        </div>
        <p className="app-subtitle">
          Actividad sísmica reciente registrada en Perú y hasta 200 km de sus fronteras.
        </p>
      </header>

      {/* Informative disclaimer banner (FR-015) */}
      <aside className="disclaimer-banner" role="note" aria-label="Aviso informativo">
        <svg
          className="disclaimer-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <div>
          <strong>Aviso informativo:</strong> Esta aplicación recopila datos públicos del Servicio
          Geológico de EE. UU. (USGS) con fines exclusivamente informativos y de consulta ciudadana.
          No sustituye ni reemplaza los avisos, alertas tempranas ni comunicados oficiales emitidos por
          las autoridades peruanas competentes (IGP, INDECI, Marina de Guerra/DHN).
        </div>
      </aside>

      {/* Status messages for Loading and Error */}
      {status === 'loading' && <StatusMessage type="loading" />}

      {status === 'error' && (
        <StatusMessage
          type="error"
          message={errorMessage}
          onRetry={loadData}
        />
      )}

      {/* Detail view when an earthquake is selected */}
      {status === 'success' && selectedEarthquake && (
        <main>
          <EarthquakeDetail
            earthquake={selectedEarthquake}
            onBack={handleBackToList}
          />
        </main>
      )}

      {/* List view and Filter controls when no earthquake is selected */}
      {status === 'success' && !selectedEarthquake && (
        <>
          <FilterPanel
            filters={filters}
            onChangePeriod={handlePeriodChange}
            onChangeMagnitude={handleMagnitudeChange}
          />

          <main>
            {filteredEarthquakes.length === 0 ? (
              <EmptyState
                selectedPeriod={filters.period}
                selectedMagnitude={filters.minimumMagnitude}
                onResetFilters={handleResetFilters}
              />
            ) : (
              <EarthquakeList
                earthquakes={filteredEarthquakes}
                onSelectEarthquake={handleSelectEarthquake}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
};
