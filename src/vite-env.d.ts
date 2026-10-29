/// <reference types="vite/client" />

declare module '*.geojson' {
  import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';
  const content: FeatureCollection<Polygon | MultiPolygon>;
  export default content;
}
