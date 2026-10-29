import React from 'react';
import { Earthquake, formatLimaDateTime, formatDepth, formatCoordinates } from '../model/earthquake';
import { formatMagnitude, getSeverityLabel } from '../model/severity';
import { SourceLink } from './SourceLink';

export interface EarthquakeDetailProps {
  earthquake: Earthquake;
  onBack: () => void;
}

export const EarthquakeDetail: React.FC<EarthquakeDetailProps> = ({ earthquake, onBack }) => {
  const severityClass = earthquake.severity || 'unknown';
  const severityLabel = getSeverityLabel(earthquake.severity);
  const formattedMag = formatMagnitude(earthquake.magnitude);
  const formattedTime = formatLimaDateTime(earthquake.occurredAt);
  const displayPlace = earthquake.place || 'Ubicación no disponible';
  const displayDepth = formatDepth(earthquake.depthKm);
  const displayCoords = formatCoordinates(earthquake.latitude, earthquake.longitude);

  return (
    <article className="detail-view" aria-label={`Detalle del sismo en ${displayPlace}`}>
      <button
        type="button"
        className="back-button"
        onClick={onBack}
        aria-label="Volver a la lista de sismos recientes"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Volver a la lista
      </button>

      <div className="detail-header">
        <div>
          <h2 className="detail-place">{displayPlace}</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            ID del evento: <code>{earthquake.id}</code>
          </p>
        </div>

        <div className={`magnitude-badge ${severityClass}`} aria-hidden="true">
          <span className="magnitude-number">{formattedMag}</span>
          <span className="severity-label-text">{severityLabel}</span>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-item-label">Magnitud</span>
          <span className="detail-item-value">{formattedMag}</span>
        </div>

        <div className="detail-item">
          <span className="detail-item-label">Nivel de gravedad</span>
          <span className="detail-item-value">{severityLabel}</span>
        </div>

        <div className="detail-item">
          <span className="detail-item-label">Fecha y hora local (Perú)</span>
          <span className="detail-item-value">{formattedTime}</span>
        </div>

        <div className="detail-item">
          <span className="detail-item-label">Profundidad</span>
          <span className="detail-item-value">{displayDepth}</span>
        </div>

        <div className="detail-item">
          <span className="detail-item-label">Coordenadas geográficas</span>
          <span className="detail-item-value">{displayCoords}</span>
        </div>

        <div className="detail-item">
          <span className="detail-item-label">Zona de monitoreo</span>
          <span className="detail-item-value">Perú y zona de 200 km</span>
        </div>
      </div>

      <div className="detail-source-row">
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'block' }}>
            Fuente de los datos:
          </span>
          <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
            Servicio Geológico de los Estados Unidos (USGS)
          </strong>
        </div>

        <SourceLink url={earthquake.sourceUrl} />
      </div>
    </article>
  );
};
