import { FreeSpot, GetFreeSpots } from '../../domain/FreeSpot';

const get: (state: FreeSpot[]) => GetFreeSpots = (state) => (date, from, to) => {
  return state
    .filter((s) => s.date === date)
    .filter((s) => s.time >= from)
    .filter((s) => s.time <= to);
};

export const freeSpotsRepository = (state: FreeSpot[] = []) => {
  return {
    get: get(state),
  };
};
