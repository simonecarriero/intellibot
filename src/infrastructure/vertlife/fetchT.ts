import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/lib/function';
import * as D from 'io-ts/Decoder';

export const fetchT = <T>(decoder: D.Decoder<unknown, T>, url: string, init: RequestInit): TE.TaskEither<Error, T> =>
  pipe(
    TE.tryCatch(() => fetch(url, init), E.toError),
    TE.flatMap((response) => TE.tryCatch(() => response.json(), E.toError)),
    TE.flatMapEither(
      flow(
        decoder.decode,
        E.mapLeft((errors) => new Error(`Response decoding failed:\n${D.draw(errors)}`)),
      ),
    ),
  );
