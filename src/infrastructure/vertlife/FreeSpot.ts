import { Ports } from '../../domain/Ports';
import { goe, loe, justTimeFromDate } from '../../domain/JustTime';
import { formatDate } from '../../domain/JustDate';

export const curriedGetFreeSpots: (basePath: string) => Ports['getFreeSpots'] =
  (basePath) => async (date, from, to) => {
    const url = `${basePath}/date/${formatDate(date, `YYYY`)}/${formatDate(date, `MM`)}/${formatDate(date, `DD`)}`;
    const response = await fetch(url, { method: `GET` });
    const json = await response.json();
    return json.slots
      .filter((s: any) => s.free_spots > 0)
      .filter((s: any) => goe(justTimeFromDate(new Date(s.slot.check_in_at)), from))
      .filter((s: any) => loe(justTimeFromDate(new Date(s.slot.check_in_at)), to))
      .map((s: any) => ({
        date: date,
        time: justTimeFromDate(new Date(s.slot.check_in_at)),
      }));
  };
