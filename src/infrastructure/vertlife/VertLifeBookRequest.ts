import { FreeSpot, User } from '../../domain/FreeSpot';
import { formatDate } from '../../domain/JustDate';
import { formatTime } from '../../domain/JustTime';

export const bookRequest = (freeSpot: FreeSpot, user: User) => ({
  slot_def_id: freeSpot.id!,
  slot_area_id: 74,
  check_in_at: `${formatDate(freeSpot.date, 'YYYY-MM-DD')}T${formatTime(freeSpot.time, 'hh:mm')}:00.000+00:00`,
  locale: 'it',
  booking: {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    participants: [
      {
        email: user.email,
        extra_fields: {},
        firstname: user.firstname,
        lastname: user.lastname,
        member: false,
        phone: user.phone,
      },
    ],
    ticket_required: false,
    skip_payment: false,
  },
});
