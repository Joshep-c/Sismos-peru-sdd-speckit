import { Earthquake, normalizeEarthquakeFeature, sortEarthquakes } from '../model/earthquake';
import { CoveragePolygon, BoundingBox, getCoverageBoundingBox, isPointInCoverage } from '../model/geography';

const USGS_BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

export interface FetchEarthquakesOptions {
  referenceDate?: Date;
  customFetch?: typeof fetch;
}

/**
 * Builds the USGS API URL for a 30-day window covering the Peru 200 km bounding box.
 */
export function buildUsgsQueryUrl(bbox: BoundingBox, referenceDate: Date = new Date()): string {
  const endTime = referenceDate.toISOString();
  // 30 days window in ms: 30 * 24 * 60 * 60 * 1000
  const startTime = new Date(referenceDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const params = new URLSearchParams({
    format: 'geojson',
    starttime: startTime,
    endtime: endTime,
    minlatitude: bbox.minLatitude.toString(),
    maxlatitude: bbox.maxLatitude.toString(),
    minlongitude: bbox.minLongitude.toString(),
    maxlongitude: bbox.maxLongitude.toString(),
  });

  return `${USGS_BASE_URL}?${params.toString()}`;
}

/**
 * Fetches recent earthquakes from USGS for the last 30 days,
 * applies the 200 km Peru coverage polygon filter, and normalizes the events.
 */
export async function fetchRecentEarthquakes(
  coverageGeometry: CoveragePolygon,
  options: FetchEarthquakesOptions = {}
): Promise<Earthquake[]> {
  const fetchFn = options.customFetch || fetch;
  const bbox = getCoverageBoundingBox(coverageGeometry);
  const url = buildUsgsQueryUrl(bbox, options.referenceDate);

  let response: Response;
  try {
    response = await fetchFn(url);
  } catch {
    throw new Error('No se pudo conectar con el servicio sísmico de USGS. Verifique su conexión a Internet.');
  }

  if (!response.ok) {
    throw new Error(`El servicio de USGS respondió con un error (código ${response.status}). Intente nuevamente más tarde.`);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error('La respuesta recibida no tiene un formato válido.');
  }

  if (!data || typeof data !== 'object') {
    throw new Error('La estructura de datos de sismos no es compatible con el formato esperado.');
  }

  const rawCollection = data as Record<string, unknown>;
  if (rawCollection.type !== 'FeatureCollection' || !Array.isArray(rawCollection.features)) {
    throw new Error('La estructura de datos de sismos no es compatible con el formato esperado.');
  }

  const earthquakes: Earthquake[] = [];

  for (const feature of rawCollection.features) {
    const earthquake = normalizeEarthquakeFeature(feature);
    if (!earthquake) {
      continue;
    }

    // Geographic inclusion: point must fall in Peru + 200 km buffer
    if (isPointInCoverage(earthquake.latitude, earthquake.longitude, coverageGeometry)) {
      earthquakes.push(earthquake);
    }
  }

  return sortEarthquakes(earthquakes);
}
