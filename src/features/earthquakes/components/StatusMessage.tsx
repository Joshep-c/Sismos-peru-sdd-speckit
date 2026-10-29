import React from 'react';

export interface StatusMessageProps {
  type: 'loading' | 'error' | 'empty';
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  title,
  message,
  onRetry,
}) => {
  if (type === 'loading') {
    return (
      <div className="status-panel" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <h2 className="status-title">{title || 'Cargando sismos recientes...'}</h2>
        <p className="status-desc">
          {message || 'Consultando el catálogo oficial de sismos de USGS para Perú y sus alrededores.'}
        </p>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="status-panel" role="alert" aria-live="assertive">
        <svg
          className="status-icon error"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="status-title">{title || 'No se pudieron cargar los datos'}</h2>
        <p className="status-desc">
          {message || 'Ocurrió un error al obtener la información de sismos. Por favor verifique su conexión e intente nuevamente.'}
        </p>
        {onRetry && (
          <button
            type="button"
            className="retry-button"
            onClick={onRetry}
            aria-label="Reintentar cargar datos de sismos"
          >
            Reintentar consulta
          </button>
        )}
      </div>
    );
  }

  // type === 'empty'
  return (
    <div className="status-panel" role="status">
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
      <h2 className="status-title">{title || 'No se encontraron sismos'}</h2>
      <p className="status-desc">
        {message || 'No hay eventos sísmicos registrados que coincidan con el periodo y la magnitud mínima seleccionados. Puede seleccionar otro periodo o cambiar la magnitud para ver más resultados.'}
      </p>
    </div>
  );
};
