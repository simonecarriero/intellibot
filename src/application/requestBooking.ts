import { Ports } from '../domain/Ports';

export const curriedRequestBooking = (ports: Pick<Ports, 'addBookingRequest'>) => ports.addBookingRequest;
