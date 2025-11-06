import 'server-only';

import { LOG_LEVEL } from '@lib/config/env';
import { pino } from 'pino';

export const logger = pino({
  level: LOG_LEVEL,
});

export default logger;
