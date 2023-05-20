import { Ports } from '../domain/Ports';

export const curriedGetPendingBookingRequests = (ports: Pick<Ports, 'getBookingRequests'>) => ports.getBookingRequests;
