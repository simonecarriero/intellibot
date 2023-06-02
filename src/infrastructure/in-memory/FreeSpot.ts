import { FreeSpot } from '../../domain/FreeSpot';
import { goe, loe, justTimeFromDate } from '../../domain/JustTime';
import { Ports } from '../../domain/Ports';

export const curriedGetFreeSpots: (state: FreeSpot[]) => Ports['getFreeSpots'] = (state) => async (date, from, to) => {
  return state
    .filter((s) => s.date.year === date.year && s.date.month === date.month && s.date.day === date.day)
    .filter((s) => goe(s.time, from))
    .filter((s) => loe(s.time, to));
};
