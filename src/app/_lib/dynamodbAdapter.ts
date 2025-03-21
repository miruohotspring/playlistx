import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const USERS_TABLE = process.env.NEXTAUTH_USERS_TABLE as string;
const SESSIONS_TABLE = process.env.NEXTAUTH_SESSIONS_TABLE as string;

export type User = {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date | null;
  image?: string;
};

export type Session = {
  sessionToken: string;
  userId: string;
  expires: Date;
};

export const DynamoDBAdapter = {
  async createUser(user: User): Promise<User> {
    const item = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified
        ? user.emailVerified.toISOString()
        : null,
      image: user.image,
    };
    await ddbDocClient.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: item,
      }),
    );
    return user;
  },

  async getUser(id: string): Promise<User | null> {
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { id },
      }),
    );
    return result.Item ? (result.Item as User) : null;
  },

  async createSession(session: Session): Promise<Session> {
    const item = {
      sessionToken: session.sessionToken,
      userId: session.userId,
      expires: session.expires.toISOString(),
    };
    await ddbDocClient.send(
      new PutCommand({
        TableName: SESSIONS_TABLE,
        Item: item,
      }),
    );
    return session;
  },

  async getSession(sessionToken: string): Promise<Session | null> {
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: SESSIONS_TABLE,
        Key: { sessionToken },
      }),
    );
    if (!result.Item) return null;
    const item = result.Item;
    return {
      sessionToken: item.sessionToken,
      userId: item.userId,
      expires: new Date(item.expires),
    };
  },

  async updateSession(session: Session): Promise<Session> {
    await ddbDocClient.send(
      new UpdateCommand({
        TableName: SESSIONS_TABLE,
        Key: { sessionToken: session.sessionToken },
        UpdateExpression: 'set expires = :expires',
        ExpressionAttributeValues: {
          ':expires': session.expires.toISOString(),
        },
      }),
    );
    return session;
  },

  async deleteSession(sessionToken: string): Promise<void> {
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: SESSIONS_TABLE,
        Key: { sessionToken },
      }),
    );
  },
};
