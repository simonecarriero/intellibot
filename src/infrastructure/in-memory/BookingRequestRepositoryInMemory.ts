import { BookingRequestRepository, BookingRequest } from '../../domain/BookingRequest';
import * as TE from 'fp-ts/TaskEither';

export class BookingRequestRepositoryInMemory implements BookingRequestRepository {
  constructor(private state: BookingRequest[] = []) {}

  add = (request: BookingRequest): TE.TaskEither<Error, void> => {
    this.state.push(request);
    return TE.of(undefined);
  };
  get = (): TE.TaskEither<Error, BookingRequest[]> => {
    return TE.of(this.state);
  };
}
