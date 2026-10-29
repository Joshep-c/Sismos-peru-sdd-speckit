import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from '../../src/features/earthquakes/components/FilterPanel';
import { EmptyState } from '../../src/features/earthquakes/components/EmptyState';
import { QueryFilterState } from '../../src/features/earthquakes/model/query-state';

describe('FilterPanel and EmptyState components', () => {
  it('renders period and magnitude options with correct initial active states', () => {
    const filters: QueryFilterState = {
      period: '7d',
      minimumMagnitude: 'all',
    };
    const onChangePeriod = vi.fn();
    const onChangeMagnitude = vi.fn();

    render(
      <FilterPanel
        filters={filters}
        onChangePeriod={onChangePeriod}
        onChangeMagnitude={onChangeMagnitude}
      />
    );

    // Check active period button
    const btn7d = screen.getByRole('button', { name: /Filtrar por Últimos 7 días/i });
    expect(btn7d).toHaveAttribute('aria-pressed', 'true');
    expect(btn7d).toHaveClass('active');

    // Check active magnitude button
    const btnAll = screen.getByRole('button', { name: /Filtrar por magnitud mínima Todas/i });
    expect(btnAll).toHaveAttribute('aria-pressed', 'true');
    expect(btnAll).toHaveClass('active');
  });

  it('calls onChangePeriod and onChangeMagnitude when buttons are clicked', () => {
    const filters: QueryFilterState = {
      period: '7d',
      minimumMagnitude: 'all',
    };
    const onChangePeriod = vi.fn();
    const onChangeMagnitude = vi.fn();

    render(
      <FilterPanel
        filters={filters}
        onChangePeriod={onChangePeriod}
        onChangeMagnitude={onChangeMagnitude}
      />
    );

    const btn24h = screen.getByRole('button', { name: /Filtrar por Últimas 24 horas/i });
    fireEvent.click(btn24h);
    expect(onChangePeriod).toHaveBeenCalledWith('24h');

    const btnMag4 = screen.getByRole('button', { name: /Filtrar por magnitud mínima ≥ 4.0/i });
    fireEvent.click(btnMag4);
    expect(onChangeMagnitude).toHaveBeenCalledWith('4.0');
  });

  it('renders EmptyState with explanation and reset action', () => {
    const onReset = vi.fn();
    render(
      <EmptyState
        selectedPeriod="24h"
        selectedMagnitude="5.0"
        onResetFilters={onReset}
      />
    );

    expect(screen.getByText('No hay sismos registrados')).toBeInTheDocument();
    expect(screen.getByText(/últimas 24 horas/i)).toBeInTheDocument();
    expect(screen.getByText(/≥ 5.0/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Restablecer filtros/i });
    fireEvent.click(resetBtn);
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
