import React from 'react';
import {
  PeriodOption,
  MinimumMagnitudeOption,
  QueryFilterState,
  PERIOD_LABELS,
  MINIMUM_MAGNITUDE_LABELS,
} from '../model/query-state';

export interface FilterPanelProps {
  filters: QueryFilterState;
  onChangePeriod: (period: PeriodOption) => void;
  onChangeMagnitude: (mag: MinimumMagnitudeOption) => void;
}

const PERIODS: PeriodOption[] = ['24h', '7d', '30d'];
const MAGNITUDES: MinimumMagnitudeOption[] = ['all', '3.0', '4.0', '5.0'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChangePeriod,
  onChangeMagnitude,
}) => {
  return (
    <nav className="filter-panel" aria-label="Filtros de actividad sísmica">
      <div className="filter-group" role="group" aria-labelledby="period-filter-label">
        <span id="period-filter-label" className="filter-label">
          Periodo
        </span>
        <div className="filter-buttons">
          {PERIODS.map((period) => {
            const isActive = filters.period === period;
            return (
              <button
                key={period}
                type="button"
                className={`filter-btn ${isActive ? 'active' : ''}`}
                onClick={() => onChangePeriod(period)}
                aria-pressed={isActive}
                aria-label={`Filtrar por ${PERIOD_LABELS[period]}`}
              >
                {period === '24h' ? '24 horas' : period === '7d' ? '7 días' : '30 días'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-group" role="group" aria-labelledby="magnitude-filter-label">
        <span id="magnitude-filter-label" className="filter-label">
          Magnitud mínima
        </span>
        <div className="filter-buttons">
          {MAGNITUDES.map((mag) => {
            const isActive = filters.minimumMagnitude === mag;
            return (
              <button
                key={mag}
                type="button"
                className={`filter-btn ${isActive ? 'active' : ''}`}
                onClick={() => onChangeMagnitude(mag)}
                aria-pressed={isActive}
                aria-label={`Filtrar por magnitud mínima ${MINIMUM_MAGNITUDE_LABELS[mag]}`}
              >
                {MINIMUM_MAGNITUDE_LABELS[mag]}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
