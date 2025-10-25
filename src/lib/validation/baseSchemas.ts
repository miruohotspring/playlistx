import { z } from 'zod';

// Common string validations
export const NonEmptyString = z.string().min(1);

// Basic pagination metadata used by APIs
export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  perPage: z.number().int().positive(),
  total: z.number().int().positive().optional(),
});

// Standard API response wrapper with data payload
export const ApiResponseSchema = z.object({
  ok: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
});

export type Pagination = z.infer<typeof PaginationSchema>;
export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};
