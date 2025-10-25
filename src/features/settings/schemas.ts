import { z } from 'zod';

// Allow only known providers
export const DisconnectProviderDto = z.object({
  provider: z.enum(['google', 'spotify', 'soundcloud']),
});

export type DisconnectProviderDto = z.infer<typeof DisconnectProviderDto>;
