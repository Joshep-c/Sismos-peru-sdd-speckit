import React from 'react';

export interface SourceLinkProps {
  url: string | null;
  label?: string;
}

export const SourceLink: React.FC<SourceLinkProps> = ({
  url,
  label = 'Ver ficha técnica oficial en USGS',
}) => {
  if (!url) {
    return (
      <span className="source-link-fallback" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        Enlace de fuente no disponible para este evento
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="external-source-link"
      aria-label={`${label} (abre en una nueva pestaña)`}
    >
      <span>{label}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  );
};
