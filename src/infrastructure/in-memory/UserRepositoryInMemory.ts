import { User } from '../../domain/FreeSpot';
import { UserRepository } from '../../domain/User';
import * as TE from 'fp-ts/TaskEither';

export class UserRepositoryInMemory implements UserRepository {
  constructor(private state: User[] = []) {}

  get = (name: string): TE.TaskEither<Error, User> => TE.of(this.state.find((s) => s.firstname === name)!);
}
