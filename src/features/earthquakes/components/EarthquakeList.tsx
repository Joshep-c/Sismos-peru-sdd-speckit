import React from 'react';
import { Earthquake } from '../model/earthquake';
import { EarthquakeCard } from './EarthquakeCard';

export interface EarthquakeListProps {
  earthquakes: Earthquake[];
  onSelectEarthquake: (earthquake: Earthquake) => void;
}

export const EarthquakeList: React.FC<EarthquakeListProps> = ({
  earthquakes,
  onSelectEarthquake,
}) => {
  return (
    <section className="earthquake-list-section" aria-label="Lista de sismos recientes">
      <div className="earthquake-list-header">
        <h2 className="earthquake-count-heading">
          {earthquakes.length === 1
            ? '1 sismo registrado'
            : `${earthquakes.length} sismos registrados`}
        </h2>
      </div>

      <ul className="earthquake-list">
        {earthquakes.map((eq) => (
          <EarthquakeCard
            key={eq.id}
            earthquake={eq}
            onSelect={onSelectEarthquake}
          />
        ))}
      </ul>
    </section>
  );
};
