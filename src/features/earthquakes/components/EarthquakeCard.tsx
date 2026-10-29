import React from 'react';
import { Earthquake, formatLimaDateTime, formatDepth } from '../model/earthquake';
import { formatMagnitude, getSeverityLabel } from '../model/severity';

export interface EarthquakeCardProps {
  earthquake: Earthquake;
  onSelect?: (earthquake: Earthquake) => void;
}

export const EarthquakeCard: React.FC<EarthquakeCardProps> = ({ earthquake, onSelect }) => {
  const severityClass = earthquake.severity || 'unknown';
  const severityLabel = getSeverityLabel(earthquake.severity);
  const formattedMag = formatMagnitude(earthquake.magnitude);
  const formattedTime = formatLimaDateTime(earthquake.occurredAt);
  const displayPlace = earthquake.place || 'Ubicación no disponible';
  const displayDepth = formatDepth(earthquake.depthKm);

  const handleClick = () => {
    if (onSelect) {
      onSelect(earthquake);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onSelect) {
      e.preventDefault();
      onSelect(earthquake);
    }
  };

  return (
    <li>
      <div
        className="earthquake-card"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Sismo de magnitud ${formattedMag}, nivel ${severityLabel}, en ${displayPlace}, ocurrido el ${formattedTime}`}
      >
        <div className="card-left">
          <div
            className={`magnitude-badge ${severityClass}`}
            aria-hidden="true"
          >
            <span className="magnitude-number">{formattedMag}</span>
            <span className="severity-label-text">{severityLabel}</span>
          </div>

          <div className="card-info">
            <h3 className="place-title">{displayPlace}</h3>
            <div className="card-meta">
              <span className="card-meta-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {formattedTime}
              </span>
              <span className="card-meta-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Profundidad: {displayDepth}
              </span>
            </div>
          </div>
        </div>

        <svg
          className="card-action-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </li>
  );
};
