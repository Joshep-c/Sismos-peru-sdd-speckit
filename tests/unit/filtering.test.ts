import { describe, it, expect } from 'vitest';
import {
  filterEarthquakes,
  matchesPeriod,
  matchesMinimumMagnitude,
  QueryFilterState,
} from '../../src/features/earthquakes/model/query-state';
import { Earthquake } from '../../src/features/earthquakes/model/earthquake';

describe('Earthquake filtering by period and minimum magnitude', () => {
  const referenceTime = 1000000000000;
  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY = 24 * ONE_HOUR;

  const sampleEarthquakes: Earthquake[] = [
    {
      id: 'eq-2h-mag3',
      magnitude: 3.5,
      place: 'Lima',
      occurredAt: referenceTime - 2 * ONE_HOUR, // 2h ago
      depthKm: 20,
      longitude: -77.0,
      latitude: -12.0,
      sourceUrl: null,
      severity: 'leve',
    },
    {
      id: 'eq-3d-mag4',
      magnitude: 4.8,
      place: 'Arequipa',
      occurredAt: referenceTime - 3 * ONE_DAY, // 3 days ago
      depthKm: 40,
      longitude: -71.5,
      latitude: -16.4,
      sourceUrl: null,
      severity: 'moderado',
    },
    {
      id: 'eq-15d-mag6',
      magnitude: 6.2,
      place: 'Pucallpa',
      occurredAt: referenceTime - 15 * ONE_DAY, // 15 days ago
      depthKm: 120,
      longitude: -74.5,
      latitude: -8.4,
      sourceUrl: null,
      severity: 'fuerte',
    },
    {
      id: 'eq-35d-mag5',
      magnitude: 5.1,
      place: 'Tacna',
      occurredAt: referenceTime - 35 * ONE_DAY, // 35 days ago (outside 30d)
      depthKm: 50,
      longitude: -70.2,
      latitude: -18.0,
      sourceUrl: null,
      severity: 'moderado',
    },
    {
      id: 'eq-1d-no-mag',
      magnitude: null,
      place: 'Iquitos',
      occurredAt: referenceTime - 12 * ONE_HOUR, // 12h ago
      depthKm: 10,
      longitude: -73.2,
      latitude: -3.7,
      sourceUrl: null,
      severity: null,
    },
  ];

  it('filters by rolling period windows (24h, 7d, 30d)', () => {
    // 24 hours: eq-2h-mag3 and eq-1d-no-mag
    const res24h = sampleEarthquakes.filter((eq) => matchesPeriod(eq, '24h', referenceTime));
    expect(res24h.map((e) => e.id)).toEqual(['eq-2h-mag3', 'eq-1d-no-mag']);

    // 7 days: eq-2h-mag3, eq-1d-no-mag, eq-3d-mag4
    const res7d = sampleEarthquakes.filter((eq) => matchesPeriod(eq, '7d', referenceTime));
    expect(res7d.map((e) => e.id)).toEqual(['eq-2h-mag3', 'eq-3d-mag4', 'eq-1d-no-mag']);

    // 30 days: excludes 35d
    const res30d = sampleEarthquakes.filter((eq) => matchesPeriod(eq, '30d', referenceTime));
    expect(res30d.map((e) => e.id)).toEqual(['eq-2h-mag3', 'eq-3d-mag4', 'eq-15d-mag6', 'eq-1d-no-mag']);
  });

  it('filters by minimum magnitude and excludes missing magnitude unless all', () => {
    // 'all' includes events with null magnitude
    expect(matchesMinimumMagnitude(sampleEarthquakes[4], 'all')).toBe(true);

    // numeric thresholds exclude null magnitude
    expect(matchesMinimumMagnitude(sampleEarthquakes[4], '3.0')).toBe(false);
    expect(matchesMinimumMagnitude(sampleEarthquakes[4], '4.0')).toBe(false);

    // 3.5 matches >= 3.0, but not >= 4.0
    expect(matchesMinimumMagnitude(sampleEarthquakes[0], '3.0')).toBe(true);
    expect(matchesMinimumMagnitude(sampleEarthquakes[0], '4.0')).toBe(false);

    // 4.8 matches >= 3.0 and >= 4.0, but not >= 5.0
    expect(matchesMinimumMagnitude(sampleEarthquakes[1], '4.0')).toBe(true);
    expect(matchesMinimumMagnitude(sampleEarthquakes[1], '5.0')).toBe(false);

    // 6.2 matches all numeric thresholds
    expect(matchesMinimumMagnitude(sampleEarthquakes[2], '5.0')).toBe(true);
  });

  it('combines period and magnitude simultaneously (AND rule)', () => {
    const filters: QueryFilterState = {
      period: '7d',
      minimumMagnitude: '4.0',
    };

    const results = filterEarthquakes(sampleEarthquakes, filters, referenceTime);
    // Only eq-3d-mag4 is both within 7 days AND magnitude >= 4.0
    expect(results.map((e) => e.id)).toEqual(['eq-3d-mag4']);
  });

  it('returns empty array when no events match the combined filter', () => {
    const filters: QueryFilterState = {
      period: '24h',
      minimumMagnitude: '5.0',
    };

    const results = filterEarthquakes(sampleEarthquakes, filters, referenceTime);
    expect(results).toEqual([]);
  });
});
