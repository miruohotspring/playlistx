import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocument,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

import { AWS_REGION } from '@lib/config/env';

export const ddbClient = new DynamoDBClient({
  region: AWS_REGION,
});

export const ddbDocument = DynamoDBDocument.from(ddbClient);

export const docClient = DynamoDBDocumentClient.from(ddbClient);
