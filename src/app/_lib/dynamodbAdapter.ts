import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import type { User, Session, Account } from 'next-auth';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import logger from '@common/logger';

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const USERS_TABLE = process.env.NEXTAUTH_USERS_TABLE as string;
const SESSIONS_TABLE = process.env.NEXTAUTH_SESSIONS_TABLE as string;
const ACCOUNTS_TABLE = process.env.NEXTAUTH_ACCOUNTS_TABLE as string;

export const DynamoDBAdapter = {
  async createUser(user: User): Promise<User> {
    logger.debug('create User');
    if (!user.id) {
      user.id = uuidv4();
    }

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
    logger.debug(user);
    return user;
  },

  async getUser(id: string): Promise<User | null> {
    logger.debug('get User');
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { id },
      }),
    );
    if (!result.Item) return null;
    const item = result.Item as {
      id: string;
      name: string;
      email: string;
      emailVerified: string | null;
      image?: string;
    };
    return {
      ...item,
      emailVerified: item.emailVerified ? new Date(item.emailVerified) : null,
    };
  },

  async createAccount(account: Account): Promise<Account> {
    logger.debug('create account');
    await ddbDocClient.send(
      new PutCommand({
        TableName: ACCOUNTS_TABLE,
        Item: account,
      }),
    );
    return account;
  },

  async linkAccount(account: Account): Promise<Account> {
    logger.debug('link account');
    await ddbDocClient.send(
      new PutCommand({
        TableName: ACCOUNTS_TABLE,
        Item: account,
      }),
    );
    return account;
  },

  async getUserByAccount({
    provider,
    providerAccountId,
  }: {
    provider: string;
    providerAccountId: string;
  }): Promise<User | null> {
    logger.debug('get user by account');
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: ACCOUNTS_TABLE,
        Key: { provider, providerAccountId },
      }),
    );
    if (!result.Item) return null;
    const account = result.Item as Account;
    if (!account.userId) return null;
    return await DynamoDBAdapter.getUser(account.userId);
  },

  async getUserByEmail(email: string): Promise<User | null> {
    logger.debug('get user by email');
    const result = await ddbDocClient.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: 'index_email',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
        Limit: 1,
      }),
    );

    if (!result.Items || result.Items.length === 0) return null;
    const item = result.Items[0] as {
      id: string;
      name: string;
      email: string;
      emailVerified: string | null;
      image?: string;
    };
    return {
      ...item,
      emailVerified: item.emailVerified ? new Date(item.emailVerified) : null,
    };
  },

  async createSession(session: Session): Promise<Session> {
    logger.debug('create session');
    const expires = new Date(session.expires).toISOString();
    const item = {
      sessionToken: session.sessionToken,
      userId: session.userId,
      expires: expires,
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
    logger.debug('get session');
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: SESSIONS_TABLE,
        Key: { sessionToken },
      }),
    );
    if (!result.Item) return null;
    const item = result.Item;
    logger.debug(item);
    return {
      sessionToken: item.sessionToken,
      userId: item.userId,
      expires: new Date(item.expires),
    };
  },

  async getSessionAndUser(
    sessionToken: string,
  ): Promise<{ session: Session; user: User } | null> {
    logger.debug('get session and user');
    const session = await DynamoDBAdapter.getSession(sessionToken);
    if (!session) return null;
    const user = await DynamoDBAdapter.getUser(session.userId);
    if (!user) return null;
    logger.debug(session);
    logger.debug(user);
    return { session, user };
  },

  async updateSession(
    session: Partial<Session> & Pick<Session, 'sessionToken'>,
  ): Promise<Session> {
    logger.debug('update session');
    const expires = session.expires?.toISOString();
    if (!session.userId || !expires) {
      throw new Error('updateSession: invalid session');
    }

    await ddbDocClient.send(
      new UpdateCommand({
        TableName: SESSIONS_TABLE,
        Key: { sessionToken: session.sessionToken },
        UpdateExpression: 'set expires = :expires, userId = :userId',
        ExpressionAttributeValues: {
          ':expires': expires,
          ':userId': session.userId,
        },
      }),
    );
    return {
      sessionToken: session.sessionToken,
      userId: session.userId,
      expires: new Date(expires as string),
    } as Session;
  },

  async deleteSession(sessionToken: string): Promise<void> {
    logger.debug('delete session');
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: SESSIONS_TABLE,
        Key: { sessionToken },
      }),
    );
  },
};
