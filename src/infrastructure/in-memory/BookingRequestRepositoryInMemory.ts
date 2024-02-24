import { BookingRequestRepository, BookingRequest } from '../../domain/BookingRequest';
import * as TE from 'fp-ts/TaskEither';

export class BookingRequestRepositoryInMemory implements BookingRequestRepository {
  constructor(private state: BookingRequest[] = []) {}

  add = (request: BookingRequest): TE.TaskEither<Error, void> => {
    this.state.push(request);
    return TE.of(undefined);
  };

  delete(request: BookingRequest): TE.TaskEither<Error, void> {
    const index = this.state.findIndex((r) => r === request);
    if (index !== -1) {
      this.state.splice(index, 1);
    }
    return TE.of(undefined);
  }

  get = (): TE.TaskEither<Error, BookingRequest[]> => {
    return TE.of(this.state);
  };
}
