'use server';

import { options } from '@api/auth/[...nextauth]/options';
import logger from '@common/logger';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const getSession = async () => {
  const session = await getServerSession(options);
  if (!session || !session.userId) {
    logger.error('User is not authenticated');
    redirect('/api/signIn');
  }
  return session;
};

export default getSession;
