import { BookingRequest } from '../domain/BookingRequest';
import { FreeSpot } from '../domain/FreeSpot';
import { CheckBookingRequests } from './checkBookingRequests';
import { GetPendingBookingRequests } from './getPendingBookingRequests';
import { RequestBooking } from './requestBooking';

export type UseCases = {
  getPendingBookingRequests: GetPendingBookingRequests;
  requestBooking: RequestBooking;
  checkBookingRequests: CheckBookingRequests;
};
