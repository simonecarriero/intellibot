import { justTime } from '../../domain/JustTime';
import { justDate } from '../../domain/JustDate';
import { curriedGetFreeSpots } from './FreeSpot';
import * as E from 'fp-ts/Either';

describe('FreeSpot vertlife', () => {
  it('should call the API and parse a successful response', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    fetchSpy.mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        slots: [
          { slot: { check_in_at: '2023-05-30T16:00:00.000Z' }, free_spots: 1 },
          { slot: { check_in_at: '2023-05-30T16:15:00.000Z' }, free_spots: 0 },
          { slot: { check_in_at: '2023-05-30T16:30:00.000Z' }, free_spots: 1 },
          { slot: { check_in_at: '2023-05-30T16:45:00.000Z' }, free_spots: 0 },
        ],
      }),
    } as Response);

    const getFreeSpots = curriedGetFreeSpots('https://example.org');

    const freeSpots = await getFreeSpots({
      date: justDate(2023, 5, 30),
      from: justTime(16, 30),
      to: justTime(17, 30),
    })();

    expect(fetchSpy).toHaveBeenCalledWith('https://example.org/date/2023/05/30', {
      method: 'GET',
    });

    expect(freeSpots).toEqual(E.right([{ date: justDate(2023, 5, 30), time: justTime(16, 30) }]));
  });
});
