export type FreeSpot = {
  date: string;
  time: string;
};

export type GetFreeSpots = (date: string, from: string, to: string) => FreeSpot[];
