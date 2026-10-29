import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EarthquakeCard } from '../../src/features/earthquakes/components/EarthquakeCard';
import { Earthquake } from '../../src/features/earthquakes/model/earthquake';

describe('Severity display accessibility in EarthquakeCard', () => {
  const baseEarthquake: Earthquake = {
    id: 'test-eq',
    magnitude: 3.8,
    place: 'Mala, Lima',
    occurredAt: Date.UTC(2026, 9, 28, 12, 0, 0),
    depthKm: 25,
    longitude: -76.6,
    latitude: -12.6,
    sourceUrl: null,
    severity: 'leve',
  };

  it('renders "Leve" text label alongside color styling', () => {
    render(<EarthquakeCard earthquake={baseEarthquake} />);
    const label = screen.getByText('Leve');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('severity-label-text');

    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('nivel Leve'));
  });

  it('renders "Moderado" text label for moderate earthquakes (e.g. 5.1)', () => {
    const moderateEq: Earthquake = {
      ...baseEarthquake,
      id: 'eq-mod',
      magnitude: 5.1,
      severity: 'moderado',
    };
    render(<EarthquakeCard earthquake={moderateEq} />);
    expect(screen.getByText('Moderado')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', expect.stringContaining('nivel Moderado'));
  });

  it('renders "Fuerte" text label for strong earthquakes (e.g. 6.8)', () => {
    const strongEq: Earthquake = {
      ...baseEarthquake,
      id: 'eq-str',
      magnitude: 6.8,
      severity: 'fuerte',
    };
    render(<EarthquakeCard earthquake={strongEq} />);
    expect(screen.getByText('Fuerte')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', expect.stringContaining('nivel Fuerte'));
  });

  it('handles missing magnitude gracefully without broken labels', () => {
    const unclassifiedEq: Earthquake = {
      ...baseEarthquake,
      id: 'eq-unclass',
      magnitude: null,
      severity: null,
    };
    render(<EarthquakeCard earthquake={unclassifiedEq} />);
    expect(screen.getByText('No clasificado')).toBeInTheDocument();
    expect(screen.getByText('N/D')).toBeInTheDocument();
  });
});
