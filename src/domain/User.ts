import { User } from './FreeSpot';
import * as TE from 'fp-ts/lib/TaskEither';

export interface UserRepository {
  get(name: string): TE.TaskEither<Error, User>;
}
