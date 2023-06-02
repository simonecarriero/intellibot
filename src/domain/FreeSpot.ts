import { JustTime } from './JustTime';
import { JustDate } from './JustDate';

export type FreeSpot = {
  date: JustDate;
  time: JustTime;
};

export type GetFreeSpots = (date: JustDate, from: JustTime, to: JustTime) => Promise<FreeSpot[]>;
