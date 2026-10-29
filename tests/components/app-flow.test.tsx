import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../../src/app/App';
import * as usgsClient from '../../src/features/earthquakes/api/usgs-client';
import { Earthquake } from '../../src/features/earthquakes/model/earthquake';

const mockEarthquakesList: Earthquake[] = [
  {
    id: 'us7000alpha',
    magnitude: 5.5,
    place: 'Mala, Lima',
    occurredAt: Date.now() - 3600 * 1000, // 1 hour ago
    depthKm: 30,
    longitude: -76.6,
    latitude: -12.6,
    sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000alpha',
    severity: 'moderado',
  },
  {
    id: 'us7000beta',
    magnitude: 3.2,
    place: 'Arequipa, Perú',
    occurredAt: Date.now() - 48 * 3600 * 1000, // 2 days ago
    depthKm: 45,
    longitude: -71.5,
    latitude: -16.4,
    sourceUrl: null,
    severity: 'leve',
  },
];

describe('App component integration and navigation flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('navigates from list to detail and preserves filter state when returning', async () => {
    vi.spyOn(usgsClient, 'fetchRecentEarthquakes').mockResolvedValue(mockEarthquakesList);

    render(<App />);

    // Wait for list to load
    await waitFor(() => {
      expect(screen.getByText('Mala, Lima')).toBeInTheDocument();
    });

    // Select filter: change magnitude to ≥ 4.0
    const btnMag4 = screen.getByRole('button', { name: /Filtrar por magnitud mínima ≥ 4.0/i });
    fireEvent.click(btnMag4);
    expect(btnMag4).toHaveAttribute('aria-pressed', 'true');

    // Beta (3.2) should be filtered out, Alpha (5.5) should be visible
    expect(screen.queryByText('Arequipa, Perú')).not.toBeInTheDocument();
    expect(screen.getByText('Mala, Lima')).toBeInTheDocument();

    // Click on Alpha to view details
    const card = screen.getByRole('button', { name: /Sismo de magnitud 5.5/i });
    fireEvent.click(card);

    // Detail view should be displayed
    expect(screen.getByRole('article', { name: /Detalle del sismo en Mala, Lima/i })).toBeInTheDocument();
    expect(screen.getByText('ID del evento:')).toBeInTheDocument();

    // Click "Volver a la lista"
    const backBtn = screen.getByRole('button', { name: /Volver a la lista de sismos recientes/i });
    fireEvent.click(backBtn);

    // Filter should still be preserved: ≥ 4.0 still active
    const btnMag4After = screen.getByRole('button', { name: /Filtrar por magnitud mínima ≥ 4.0/i });
    expect(btnMag4After).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText('Arequipa, Perú')).not.toBeInTheDocument();
    expect(screen.getByText('Mala, Lima')).toBeInTheDocument();
  });
});
