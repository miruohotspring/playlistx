import 'server-only';

import { pino } from 'pino';
import { LOG_LEVEL } from '@lib/config';

export const logger = pino({
  level: LOG_LEVEL,
});

export default logger;
