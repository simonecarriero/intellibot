import { justTime } from '../../domain/JustTime';
import { justDate } from '../../domain/JustDate';
import { curriedGetFreeSpots } from './FreeSpot';

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

    const freeSpots = await getFreeSpots(justDate(2023, 5, 30), justTime(16, 30), justTime(17, 30));

    expect(fetchSpy).toHaveBeenCalledWith('https://example.org/date/2023/05/30', {
      method: 'GET',
    });

    expect(freeSpots).toEqual([{ date: justDate(2023, 5, 30), time: justTime(16, 30) }]);
  });
});
