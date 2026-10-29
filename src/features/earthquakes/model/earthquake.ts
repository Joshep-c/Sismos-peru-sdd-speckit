import { calculateSeverity, SeverityLevel } from './severity';
import { isValidCoordinate } from './geography';

export interface Earthquake {
  id: string;
  magnitude: number | null;
  place: string | null;
  occurredAt: number; // UTC timestamp in milliseconds
  depthKm: number | null;
  longitude: number;
  latitude: number;
  sourceUrl: string | null;
  severity: SeverityLevel | null;
}

/**
 * Normalizes and validates a USGS GeoJSON Feature into an Earthquake object.
 * Returns null if required data (id, valid point geometry, valid timestamp) is missing or invalid.
 */
export function normalizeEarthquakeFeature(feature: unknown): Earthquake | null {
  if (!feature || typeof feature !== 'object') {
    return null;
  }

  const raw = feature as Record<string, unknown>;

  // ID validation
  const rawId = raw.id;
  const id = typeof rawId === 'string' ? rawId.trim() : rawId ? String(rawId).trim() : '';
  if (!id) {
    return null;
  }

  // Geometry validation: must be Point with at least 2 coordinates
  const geometry = raw.geometry as Record<string, unknown> | undefined;
  if (!geometry || geometry.type !== 'Point' || !Array.isArray(geometry.coordinates)) {
    return null;
  }

  const [lon, lat, depth] = geometry.coordinates;
  if (!isValidCoordinate(lat, lon)) {
    return null;
  }

  // Time validation: must be finite timestamp
  const properties = (raw.properties as Record<string, unknown> | undefined) || {};
  const rawTime = properties.time;
  if (typeof rawTime !== 'number' || !Number.isFinite(rawTime) || rawTime <= 0) {
    return null;
  }

  // Optional fields normalization (no invented values)
  const rawMag = properties.mag;
  const magnitude = typeof rawMag === 'number' && Number.isFinite(rawMag) ? rawMag : null;

  const rawPlace = properties.place;
  const place = typeof rawPlace === 'string' && rawPlace.trim().length > 0 ? rawPlace.trim() : null;

  const depthKm = typeof depth === 'number' && Number.isFinite(depth) ? Number(depth.toFixed(1)) : null;

  // Source URL validation
  const rawUrl = properties.url;
  let sourceUrl: string | null = null;
  if (typeof rawUrl === 'string' && rawUrl.startsWith('http')) {
    try {
      new URL(rawUrl);
      sourceUrl = rawUrl;
    } catch {
      sourceUrl = null;
    }
  }

  const severity = calculateSeverity(magnitude);

  return {
    id,
    magnitude,
    place,
    occurredAt: rawTime,
    depthKm,
    longitude: Number(lon.toFixed(4)),
    latitude: Number(lat.toFixed(4)),
    sourceUrl,
    severity,
  };
}

/**
 * Sorts earthquakes from most recent to oldest.
 * If two earthquakes share the exact same timestamp, breaks ties stably using earthquake id.
 */
export function sortEarthquakes(earthquakes: Earthquake[]): Earthquake[] {
  return [...earthquakes].sort((a, b) => {
    if (b.occurredAt !== a.occurredAt) {
      return b.occurredAt - a.occurredAt;
    }
    return a.id.localeCompare(b.id);
  });
}

/**
 * Formats a UTC timestamp into Peru local time (America/Lima timezone).
 */
export function formatLimaDateTime(timestamp: number): string {
  try {
    return new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date(timestamp));
  } catch {
    return new Date(timestamp).toISOString();
  }
}

/**
 * Formats depth in kilometers with honest fallback.
 */
export function formatDepth(depthKm: number | null): string {
  if (depthKm === null || !Number.isFinite(depthKm)) {
    return 'No disponible';
  }
  return `${depthKm} km`;
}

/**
 * Formats coordinates into human-readable string.
 */
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'O';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}
