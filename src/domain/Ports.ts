import { AddBookingRequest, GetBookingRequests } from './BookingRequest';
import { GetFreeSpots } from './FreeSpot';

export type Ports = {
  addBookingRequest: AddBookingRequest;
  getBookingRequests: GetBookingRequests;
  getFreeSpots: GetFreeSpots;
};
