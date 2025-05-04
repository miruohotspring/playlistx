import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocument,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION || 'ap-northeast-1';

export const ddbClient = new DynamoDBClient({
  region: REGION,
});

export const ddbDocument = DynamoDBDocument.from(ddbClient);

export const docClient = DynamoDBDocumentClient.from(ddbClient);
