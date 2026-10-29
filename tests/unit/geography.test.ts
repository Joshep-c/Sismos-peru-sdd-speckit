import { describe, it, expect } from 'vitest';
import {
  createCoverageBuffer,
  getCoverageBoundingBox,
  isValidCoordinate,
  isPointInCoverage,
} from '../../src/features/earthquakes/model/geography';
import peruGeoJson from '../../public/data/peru-boundary.geojson';

describe('geography model helpers', () => {
  it('validates coordinate boundaries', () => {
    expect(isValidCoordinate(-12.0464, -77.0428)).toBe(true); // Lima
    expect(isValidCoordinate(91, 0)).toBe(false);
    expect(isValidCoordinate(0, 185)).toBe(false);
    expect(isValidCoordinate(NaN, -77)).toBe(false);
    expect(isValidCoordinate('invalid', -77)).toBe(false);
  });

  it('computes coverage buffer and bounding box from Peru boundary', () => {
    const coverage = createCoverageBuffer(peruGeoJson, 200);
    expect(coverage).toBeDefined();

    const bbox = getCoverageBoundingBox(coverage);
    // Peru + 200km should cover roughly -21° to 2° lat, -84° to -66° lon
    expect(bbox.minLatitude).toBeLessThan(-18);
    expect(bbox.maxLatitude).toBeGreaterThan(0);
    expect(bbox.minLongitude).toBeLessThan(-81);
    expect(bbox.maxLongitude).toBeGreaterThan(-69);
  });

  it('verifies points inside Peru, within 200km buffer, and far outside', () => {
    const coverage = createCoverageBuffer(peruGeoJson, 200);

    // Lima, Peru is inside
    expect(isPointInCoverage(-12.0464, -77.0428, coverage)).toBe(true);

    // Arequipa, Peru is inside
    expect(isPointInCoverage(-16.409, -71.5375, coverage)).toBe(true);

    // Offshore Peru within 200 km (e.g. 50 km off Callao coast: -12.05, -77.6)
    expect(isPointInCoverage(-12.05, -77.6, coverage)).toBe(true);

    // Madrid, Spain is far outside
    expect(isPointInCoverage(40.4168, -3.7038, coverage)).toBe(false);

    // Tokyo is outside
    expect(isPointInCoverage(35.6762, 139.6503, coverage)).toBe(false);
  });
});
