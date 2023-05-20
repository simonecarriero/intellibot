import { Ports } from '../domain/Ports';
import { UseCases } from './UseCases';

export const curriedRequestBooking = (ports: Pick<Ports, 'addBookingRequest'>): UseCases['requestBooking'] =>
  ports.addBookingRequest;
