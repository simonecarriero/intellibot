import { BookingRequest, BookingRequestRepository } from '../../../domain/BookingRequest';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

export class BookingRequestRepositoryDynamo implements BookingRequestRepository {
  constructor(private tableName: string) {}

  add = (request: BookingRequest): TE.TaskEither<Error, void> => {
    return pipe(
      TE.tryCatch(
        () =>
          dynamoClient()
            .put({ TableName: this.tableName, Item: { PK: 'requests', json: JSON.stringify([request]) } })
            .promise(),
        E.toError,
      ),
      TE.map((response) => {}),
    );
  };
  get = (): TE.TaskEither<Error, BookingRequest[]> => {
    return pipe(
      TE.tryCatch(
        () =>
          dynamoClient()
            .get({ TableName: this.tableName, Key: { PK: 'requests' } })
            .promise(),
        E.toError,
      ),
      TE.map((response) => (response.$response.data?.Item ? JSON.parse(response.$response.data?.Item?.json) : [])),
    );
  };
}

const dynamoClient = () =>
  new DynamoDB.DocumentClient({
    endpoint: process.env.LOCALSTACK_HOSTNAME ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566` : undefined,
  });
