import { describe, it, expect } from 'vitest';
import {
  calculateSeverity,
  getSeverityLabel,
  formatMagnitude,
} from '../../src/features/earthquakes/model/severity';

describe('Severity classification and magnitude formatting', () => {
  it('classifies magnitudes below 4.0 as leve', () => {
    expect(calculateSeverity(1.0)).toBe('leve');
    expect(calculateSeverity(2.5)).toBe('leve');
    expect(calculateSeverity(3.9)).toBe('leve');
    expect(calculateSeverity(3.99)).toBe('leve');
  });

  it('classifies magnitudes from 4.0 up to 5.9 as moderado (including exact 4.0 boundary)', () => {
    expect(calculateSeverity(4.0)).toBe('moderado');
    expect(calculateSeverity(4.5)).toBe('moderado');
    expect(calculateSeverity(5.0)).toBe('moderado');
    expect(calculateSeverity(5.9)).toBe('moderado');
    expect(calculateSeverity(5.99)).toBe('moderado');
  });

  it('classifies magnitudes from 6.0 and above as fuerte (including exact 6.0 boundary)', () => {
    expect(calculateSeverity(6.0)).toBe('fuerte');
    expect(calculateSeverity(6.5)).toBe('fuerte');
    expect(calculateSeverity(7.8)).toBe('fuerte');
    expect(calculateSeverity(9.5)).toBe('fuerte');
  });

  it('returns null for missing, null, undefined, or non-finite magnitudes', () => {
    expect(calculateSeverity(null)).toBeNull();
    expect(calculateSeverity(undefined)).toBeNull();
    expect(calculateSeverity(NaN)).toBeNull();
    expect(calculateSeverity(Infinity)).toBeNull();
  });

  it('provides explicit text labels in Spanish without relying on color alone', () => {
    expect(getSeverityLabel('leve')).toBe('Leve');
    expect(getSeverityLabel('moderado')).toBe('Moderado');
    expect(getSeverityLabel('fuerte')).toBe('Fuerte');
    expect(getSeverityLabel(null)).toBe('No clasificado');
  });

  it('formats magnitude to exactly one decimal place or honest fallback', () => {
    expect(formatMagnitude(4)).toBe('4.0');
    expect(formatMagnitude(5.24)).toBe('5.2');
    expect(formatMagnitude(6.98)).toBe('7.0');
    expect(formatMagnitude(null)).toBe('N/D');
    expect(formatMagnitude(undefined)).toBe('N/D');
  });
});
