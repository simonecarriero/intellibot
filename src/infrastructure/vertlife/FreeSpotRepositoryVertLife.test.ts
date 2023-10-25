import { justDate } from '../../domain/JustDate';
import { justTime } from '../../domain/JustTime';
import { FreeSpotRepositoryVertLife } from './FreeSpotRepositoryVertLife';
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

    const freeSpotRepository = new FreeSpotRepositoryVertLife('https://example.org');

    const freeSpots = await freeSpotRepository.get({
      date: justDate(2023, 5, 30),
      from: justTime(16, 30),
      to: justTime(17, 30),
    })();

    expect(fetchSpy).toHaveBeenCalledWith('https://example.org/date/2023/05/30', {
      method: 'GET',
    });

    expect(freeSpots).toEqual(E.right([{ date: justDate(2023, 5, 30), time: justTime(16, 30) }]));
  });

  it('should call the API and parse a bad response', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    fetchSpy.mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ slots: [{ free_spots: 1 }] }),
    } as Response);

    const freeSpotRepository = new FreeSpotRepositoryVertLife('https://example.org');

    const freeSpots = await freeSpotRepository.get({
      date: justDate(2023, 5, 30),
      from: justTime(16, 30),
      to: justTime(17, 30),
    })();

    const expected =
      `Response decoding failed:\n` +
      `required property "slots"\n` +
      `└─ optional index 0\n` +
      `   └─ required property "slot"\n` +
      `      └─ cannot decode undefined, should be Record<string, unknown>`;

    expect(freeSpots).toEqual(E.left(new Error(expected)));
  });
});
