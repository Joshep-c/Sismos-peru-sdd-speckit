import { buffer } from '@turf/buffer';
import { bbox } from '@turf/bbox';
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import { point as turfPoint } from '@turf/helpers';
import type { Feature, Polygon, MultiPolygon, FeatureCollection } from 'geojson';

export interface BoundingBox {
  minLongitude: number;
  minLatitude: number;
  maxLongitude: number;
  maxLatitude: number;
}

export type CoveragePolygon = Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon>;

/**
 * Generates a 200 km buffer around the provided boundary feature.
 */
export function createCoverageBuffer(
  boundary: CoveragePolygon,
  distanceKm: number = 200
): Feature<Polygon | MultiPolygon> {
  const buffered = buffer(boundary, distanceKm, { units: 'kilometers' });
  if (!buffered) {
    throw new Error('Failed to create coverage buffer from boundary.');
  }
  return buffered as Feature<Polygon | MultiPolygon>;
}

/**
 * Computes the bounding box of the buffered coverage polygon for remote querying.
 */
export function getCoverageBoundingBox(coverageGeometry: CoveragePolygon): BoundingBox {
  const [minX, minY, maxX, maxY] = bbox(coverageGeometry);
  return {
    minLongitude: Number(minX.toFixed(4)),
    minLatitude: Number(minY.toFixed(4)),
    maxLongitude: Number(maxX.toFixed(4)),
    maxLatitude: Number(maxY.toFixed(4)),
  };
}

/**
 * Validates whether numeric latitude and longitude represent valid geographical coordinates.
 */
export function isValidCoordinate(latitude: unknown, longitude: unknown): boolean {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return false;
  }
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return false;
  }
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

/**
 * Determines whether a given coordinate point falls inside (or on the boundary of) the coverage geometry.
 */
export function isPointInCoverage(
  latitude: number,
  longitude: number,
  coverageGeometry: CoveragePolygon
): boolean {
  if (!isValidCoordinate(latitude, longitude)) {
    return false;
  }

  const pt = turfPoint([longitude, latitude]);

  if (coverageGeometry.type === 'FeatureCollection') {
    return coverageGeometry.features.some((feature) =>
      booleanPointInPolygon(pt, feature as Feature<Polygon | MultiPolygon>, { ignoreBoundary: false })
    );
  }

  return booleanPointInPolygon(pt, coverageGeometry, { ignoreBoundary: false });
}
