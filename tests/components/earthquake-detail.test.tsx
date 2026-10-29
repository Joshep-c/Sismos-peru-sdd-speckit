import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EarthquakeDetail } from '../../src/features/earthquakes/components/EarthquakeDetail';
import { Earthquake } from '../../src/features/earthquakes/model/earthquake';

describe('EarthquakeDetail component', () => {
  const mockEarthquakeWithSource: Earthquake = {
    id: 'us7000testDetail1',
    magnitude: 6.4,
    place: '70 km al O de Chimbote, Perú',
    occurredAt: Date.UTC(2026, 9, 28, 18, 15, 0),
    depthKm: 42.0,
    longitude: -79.2,
    latitude: -9.1,
    sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000testDetail1',
    severity: 'fuerte',
  };

  const mockEarthquakeWithoutSource: Earthquake = {
    id: 'us7000testDetail2',
    magnitude: 3.5,
    place: null,
    occurredAt: Date.UTC(2026, 9, 28, 10, 0, 0),
    depthKm: null,
    longitude: -77.0,
    latitude: -12.0,
    sourceUrl: null,
    severity: 'leve',
  };

  it('renders all detailed fields including magnitude, severity, coordinates, and local time', () => {
    const onBack = vi.fn();
    render(<EarthquakeDetail earthquake={mockEarthquakeWithSource} onBack={onBack} />);

    expect(screen.getByText('70 km al O de Chimbote, Perú')).toBeInTheDocument();
    expect(screen.getAllByText('6.4').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Fuerte').length).toBeGreaterThan(0);
    expect(screen.getByText('42 km')).toBeInTheDocument();
    expect(screen.getByText(/9.1000° S, 79.2000° O/)).toBeInTheDocument();
    expect(screen.getByText(/28\/10\/2026/)).toBeInTheDocument();
  });

  it('renders safe external link with target=_blank and rel=noopener noreferrer when sourceUrl is present', () => {
    const onBack = vi.fn();
    render(<EarthquakeDetail earthquake={mockEarthquakeWithSource} onBack={onBack} />);

    const link = screen.getByRole('link', { name: /Ver ficha técnica oficial en USGS/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', mockEarthquakeWithSource.sourceUrl!);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders clear fallback when sourceUrl is not available without inventing values', () => {
    const onBack = vi.fn();
    render(<EarthquakeDetail earthquake={mockEarthquakeWithoutSource} onBack={onBack} />);

    expect(
      screen.getByText('Enlace de fuente no disponible para este evento')
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Ubicación no disponible')).toBeInTheDocument();
    expect(screen.getByText('No disponible')).toBeInTheDocument();
  });

  it('triggers onBack callback when the back button is clicked', () => {
    const onBack = vi.fn();
    render(<EarthquakeDetail earthquake={mockEarthquakeWithSource} onBack={onBack} />);

    const backBtn = screen.getByRole('button', { name: /Volver a la lista de sismos recientes/i });
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
