import { Ports } from '../domain/Ports';
import { UseCases } from './UseCases';

export const curriedGetPendingBookingRequests = (
  ports: Pick<Ports, 'getBookingRequests'>,
): UseCases['getPendingBookingRequests'] => ports.getBookingRequests;
