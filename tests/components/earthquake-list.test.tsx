import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EarthquakeList } from '../../src/features/earthquakes/components/EarthquakeList';
import { StatusMessage } from '../../src/features/earthquakes/components/StatusMessage';
import { Earthquake } from '../../src/features/earthquakes/model/earthquake';

const mockEarthquakes: Earthquake[] = [
  {
    id: 'us7000test1',
    magnitude: 5.5,
    place: '45 km al SO de Pisco, Perú',
    occurredAt: Date.UTC(2026, 9, 28, 14, 30, 0),
    depthKm: 32.5,
    longitude: -76.5,
    latitude: -14.1,
    sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000test1',
    severity: 'moderado',
  },
  {
    id: 'us7000test2',
    magnitude: null,
    place: null,
    occurredAt: Date.UTC(2026, 9, 28, 10, 0, 0),
    depthKm: null,
    longitude: -77.0,
    latitude: -12.0,
    sourceUrl: null,
    severity: null,
  },
];

describe('EarthquakeList and StatusMessage components', () => {
  it('renders the list with formatted items and fallbacks for missing data', () => {
    const handleSelect = vi.fn();
    render(
      <EarthquakeList
        earthquakes={mockEarthquakes}
        onSelectEarthquake={handleSelect}
      />
    );

    // Checks header count
    expect(screen.getByText('2 sismos registrados')).toBeInTheDocument();

    // Check first item details
    expect(screen.getByText('45 km al SO de Pisco, Perú')).toBeInTheDocument();
    expect(screen.getByText('5.5')).toBeInTheDocument();
    expect(screen.getByText('Moderado')).toBeInTheDocument();
    expect(screen.getByText(/Profundidad: 32.5 km/)).toBeInTheDocument();

    // Check honest fallbacks on second item
    expect(screen.getByText('Ubicación no disponible')).toBeInTheDocument();
    expect(screen.getByText('N/D')).toBeInTheDocument();
    expect(screen.getByText('No clasificado')).toBeInTheDocument();
    expect(screen.getByText(/Profundidad: No disponible/)).toBeInTheDocument();
  });

  it('triggers onSelectEarthquake when card is clicked or activated with keyboard', () => {
    const handleSelect = vi.fn();
    render(
      <EarthquakeList
        earthquakes={mockEarthquakes}
        onSelectEarthquake={handleSelect}
      />
    );

    const firstCard = screen.getByRole('button', {
      name: /Sismo de magnitud 5.5, nivel Moderado/i,
    });

    fireEvent.click(firstCard);
    expect(handleSelect).toHaveBeenCalledWith(mockEarthquakes[0]);

    fireEvent.keyDown(firstCard, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledTimes(2);
  });

  it('renders loading state with StatusMessage', () => {
    render(<StatusMessage type="loading" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Cargando sismos recientes...')).toBeInTheDocument();
  });

  it('renders error state with retry button', () => {
    const handleRetry = vi.fn();
    render(
      <StatusMessage
        type="error"
        message="Fallo de conexión"
        onRetry={handleRetry}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Fallo de conexión')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Reintentar/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
