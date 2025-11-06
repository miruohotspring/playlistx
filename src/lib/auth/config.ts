'use server';

import { options } from '@api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

export const getSession = async () => {
  const session = await getServerSession(options);
  return session;
};

export default getSession;
