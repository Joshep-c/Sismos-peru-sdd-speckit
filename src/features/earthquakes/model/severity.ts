export type SeverityLevel = 'leve' | 'moderado' | 'fuerte';

/**
 * Calculates earthquake severity category according to specification:
 * - < 4.0: leve
 * - 4.0 to < 6.0: moderado
 * - >= 6.0: fuerte
 */
export function calculateSeverity(magnitude: number | null | undefined): SeverityLevel | null {
  if (magnitude === null || magnitude === undefined || !Number.isFinite(magnitude)) {
    return null;
  }

  if (magnitude < 4.0) {
    return 'leve';
  }
  if (magnitude < 6.0) {
    return 'moderado';
  }
  return 'fuerte';
}

/**
 * Returns user-facing label for severity level.
 */
export function getSeverityLabel(severity: SeverityLevel | null | undefined): string {
  switch (severity) {
    case 'leve':
      return 'Leve';
    case 'moderado':
      return 'Moderado';
    case 'fuerte':
      return 'Fuerte';
    default:
      return 'No clasificado';
  }
}

/**
 * Formats a magnitude number to 1 decimal place as required by FR-005.
 * Returns honest fallback if unavailable.
 */
export function formatMagnitude(magnitude: number | null | undefined): string {
  if (magnitude === null || magnitude === undefined || !Number.isFinite(magnitude)) {
    return 'N/D';
  }
  return magnitude.toFixed(1);
}
