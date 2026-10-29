import React from 'react';
import { PeriodOption, MinimumMagnitudeOption, PERIOD_LABELS, MINIMUM_MAGNITUDE_LABELS } from '../model/query-state';

export interface EmptyStateProps {
  selectedPeriod: PeriodOption;
  selectedMagnitude: MinimumMagnitudeOption;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  selectedPeriod,
  selectedMagnitude,
  onResetFilters,
}) => {
  const periodText = PERIOD_LABELS[selectedPeriod].toLowerCase();
  const magText =
    selectedMagnitude === 'all'
      ? 'todas las magnitudes'
      : `magnitud ${MINIMUM_MAGNITUDE_LABELS[selectedMagnitude]}`;

  return (
    <section className="status-panel" role="status" aria-label="Sin resultados de búsqueda">
      <svg
        className="status-icon"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <h2 className="status-title">No hay sismos registrados</h2>
      <p className="status-desc">
        No se encontraron eventos para <strong>{periodText}</strong> con{' '}
        <strong>{magText}</strong> en la zona de cobertura. Puede probar cambiando los filtros en el
        panel superior.
      </p>
      {onResetFilters && (
        <button
          type="button"
          className="retry-button"
          onClick={onResetFilters}
          aria-label="Restablecer filtros a valores iniciales"
        >
          Restablecer filtros
        </button>
      )}
    </section>
  );
};
