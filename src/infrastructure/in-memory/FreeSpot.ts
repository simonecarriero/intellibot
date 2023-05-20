import { FreeSpot } from '../../domain/FreeSpot';
import { Ports } from '../../domain/Ports';

export const curriedGetFreeSpots: (state: FreeSpot[]) => Ports['getFreeSpots'] = (state) => (date, from, to) => {
  return state
    .filter((s) => s.date === date)
    .filter((s) => s.time >= from)
    .filter((s) => s.time <= to);
};
