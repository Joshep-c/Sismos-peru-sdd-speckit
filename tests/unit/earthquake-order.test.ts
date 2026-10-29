import { describe, it, expect } from 'vitest';
import {
  sortEarthquakes,
  formatLimaDateTime,
  Earthquake,
} from '../../src/features/earthquakes/model/earthquake';

describe('Earthquake ordering and Lima timezone formatting', () => {
  it('orders earthquakes from most recent to oldest', () => {
    const list: Earthquake[] = [
      {
        id: 'eq-1',
        magnitude: 4.5,
        place: 'Callao',
        occurredAt: 1000,
        depthKm: 30,
        longitude: -77.1,
        latitude: -12.0,
        sourceUrl: null,
        severity: 'moderado',
      },
      {
        id: 'eq-2',
        magnitude: 5.2,
        place: 'Arequipa',
        occurredAt: 5000,
        depthKm: 50,
        longitude: -71.5,
        latitude: -16.4,
        sourceUrl: null,
        severity: 'moderado',
      },
      {
        id: 'eq-3',
        magnitude: 3.1,
        place: 'Cusco',
        occurredAt: 3000,
        depthKm: 20,
        longitude: -71.9,
        latitude: -13.5,
        sourceUrl: null,
        severity: 'leve',
      },
    ];

    const sorted = sortEarthquakes(list);
    expect(sorted.map((eq) => eq.id)).toEqual(['eq-2', 'eq-3', 'eq-1']);
  });

  it('breaks ties deterministically using earthquake id when occurredAt is identical', () => {
    const list: Earthquake[] = [
      {
        id: 'eq-c',
        magnitude: 4.0,
        place: 'Lima',
        occurredAt: 2000,
        depthKm: 15,
        longitude: -77.0,
        latitude: -12.0,
        sourceUrl: null,
        severity: 'moderado',
      },
      {
        id: 'eq-a',
        magnitude: 4.0,
        place: 'Lima',
        occurredAt: 2000,
        depthKm: 15,
        longitude: -77.0,
        latitude: -12.0,
        sourceUrl: null,
        severity: 'moderado',
      },
      {
        id: 'eq-b',
        magnitude: 4.0,
        place: 'Lima',
        occurredAt: 2000,
        depthKm: 15,
        longitude: -77.0,
        latitude: -12.0,
        sourceUrl: null,
        severity: 'moderado',
      },
    ];

    const sorted = sortEarthquakes(list);
    expect(sorted.map((eq) => eq.id)).toEqual(['eq-a', 'eq-b', 'eq-c']);
  });

  it('formats UTC timestamp into America/Lima (UTC-5) local date and time', () => {
    // 2026-10-28 17:00:00 UTC = 2026-10-28 12:00:00 in Lima (UTC-5)
    const utcTimestamp = Date.UTC(2026, 9, 28, 17, 0, 0);
    const formatted = formatLimaDateTime(utcTimestamp);

    // Should contain 28/10/2026 and 12:00:00
    expect(formatted).toContain('28/10/2026');
    expect(formatted).toContain('12:00:00');
  });
});
