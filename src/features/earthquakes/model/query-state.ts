import { Earthquake } from './earthquake';

export type PeriodOption = '24h' | '7d' | '30d';
export type MinimumMagnitudeOption = 'all' | '3.0' | '4.0' | '5.0';

export interface QueryFilterState {
  period: PeriodOption;
  minimumMagnitude: MinimumMagnitudeOption;
}

export const DEFAULT_QUERY_STATE: QueryFilterState = {
  period: '7d',
  minimumMagnitude: 'all',
};

export const PERIOD_LABELS: Record<PeriodOption, string> = {
  '24h': 'Últimas 24 horas',
  '7d': 'Últimos 7 días',
  '30d': 'Últimos 30 días',
};

export const PERIOD_DURATIONS_MS: Record<PeriodOption, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

export const MINIMUM_MAGNITUDE_LABELS: Record<MinimumMagnitudeOption, string> = {
  all: 'Todas',
  '3.0': '≥ 3.0',
  '4.0': '≥ 4.0',
  '5.0': '≥ 5.0',
};

/**
 * Checks if an earthquake matches the selected period window.
 * The period is evaluated as a rolling window from referenceTimeMs.
 */
export function matchesPeriod(
  earthquake: Earthquake,
  period: PeriodOption,
  referenceTimeMs: number = Date.now()
): boolean {
  const durationMs = PERIOD_DURATIONS_MS[period];
  const cutoffMs = referenceTimeMs - durationMs;
  return earthquake.occurredAt >= cutoffMs && earthquake.occurredAt <= referenceTimeMs;
}

/**
 * Checks if an earthquake matches the minimum magnitude filter.
 * An event without a valid magnitude only matches 'all'.
 */
export function matchesMinimumMagnitude(
  earthquake: Earthquake,
  minMag: MinimumMagnitudeOption
): boolean {
  if (minMag === 'all') {
    return true;
  }
  if (earthquake.magnitude === null || earthquake.magnitude === undefined) {
    return false;
  }
  const threshold = parseFloat(minMag);
  return earthquake.magnitude >= threshold;
}

/**
 * Applies both period and minimum magnitude filters simultaneously (AND operation).
 */
export function filterEarthquakes(
  earthquakes: Earthquake[],
  filters: QueryFilterState,
  referenceTimeMs: number = Date.now()
): Earthquake[] {
  return earthquakes.filter(
    (eq) =>
      matchesPeriod(eq, filters.period, referenceTimeMs) &&
      matchesMinimumMagnitude(eq, filters.minimumMagnitude)
  );
}
