import DynamoDB from 'aws-sdk/clients/dynamodb';
import { BookingRequest } from '../../../domain/BookingRequest';

export const addBookingRequest =
  (tableName: string) =>
  async (request: BookingRequest): Promise<void> => {
    const client = dynamoClient();
    const params = {
      TableName: tableName,
      Item: {
        PK: 'requests',
        json: JSON.stringify([request]),
      },
    };
    await client.put(params).promise();
  };

export const getBookingRequests = (tableName: string) => async (): Promise<BookingRequest[]> => {
  const client = dynamoClient();
  const response = await client.get({ TableName: tableName, Key: { PK: 'requests' } }).promise();
  return response.$response.data?.Item ? JSON.parse(response.$response.data?.Item?.json) : [];
};

const dynamoClient = () =>
  new DynamoDB.DocumentClient({
    endpoint: process.env.LOCALSTACK_HOSTNAME ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566` : undefined,
  });
