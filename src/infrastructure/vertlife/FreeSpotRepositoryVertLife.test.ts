import { justDate } from '../../domain/JustDate';
import { justTime } from '../../domain/JustTime';
import { FreeSpotRepositoryVertLife } from './FreeSpotRepositoryVertLife';
import * as E from 'fp-ts/Either';

describe('FreeSpot vertlife', () => {
  it('calls the API and parse a successful response', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    fetchSpy.mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        slots: [
          { slot: { check_in_at: '2023-05-30T16:00:00.000Z' }, free_spots: 1, def_id: 35 },
          { slot: { check_in_at: '2023-05-30T16:15:00.000Z' }, free_spots: 0, def_id: 35 },
          { slot: { check_in_at: '2023-05-30T16:30:00.000Z' }, free_spots: 1, def_id: 35 },
          { slot: { check_in_at: '2023-05-30T16:45:00.000Z' }, free_spots: 0, def_id: 35 },
        ],
      }),
    } as Response);

    const freeSpotRepository = new FreeSpotRepositoryVertLife('https://example.org');

    const freeSpots = await freeSpotRepository.get({
      date: justDate(2023, 5, 30),
      from: justTime(16, 30),
      to: justTime(17, 30),
      chat: 123,
    })();

    expect(fetchSpy).toHaveBeenCalledWith('https://example.org/public-slots/at/74/date/2023/05/30', {
      method: 'GET',
    });

    expect(freeSpots).toEqual(E.right([{ id: 35, date: justDate(2023, 5, 30), time: justTime(16, 30) }]));
  });

  it('calls the API and parse a bad response', async () => {
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
      chat: 123,
    })();

    const expected =
      `Response decoding failed:\n` +
      `required property "slots"\n` +
      `└─ optional index 0\n` +
      `   ├─ required property "def_id"\n` +
      `   │  └─ cannot decode undefined, should be number\n` +
      `   └─ required property "slot"\n` +
      `      └─ cannot decode undefined, should be Record<string, unknown>`;

    expect(freeSpots).toEqual(E.left(new Error(expected)));
  });

  it('calls the book API', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    fetchSpy.mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({}),
    } as Response);

    const freeSpotRepository = new FreeSpotRepositoryVertLife('https://example.org');

    const freeSpot = { id: 42, date: justDate(2020, 1, 1), time: justTime(18, 30) };
    const user = {
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane.doe@example.com',
      phone: '0123456789',
    };
    const freeSpots = await freeSpotRepository.book(freeSpot, user)();

    expect(fetchSpy).toHaveBeenCalledWith('https://example.org/book', {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: JSON.stringify({
        slot_def_id: 42,
        slot_area_id: 74,
        check_in_at: '2020-01-01T18:30:00.000+00:00',
        locale: 'it',
        booking: {
          firstname: 'Jane',
          lastname: 'Doe',
          email: 'jane.doe@example.com',
          phone: '0123456789',
          participants: [
            {
              email: 'jane.doe@example.com',
              extra_fields: {},
              firstname: 'Jane',
              lastname: 'Doe',
              member: false,
              phone: '0123456789',
            },
          ],
          ticket_required: false,
          skip_payment: false,
        },
      }),
    });
    expect(freeSpots).toEqual(E.right(undefined));
  });
});
