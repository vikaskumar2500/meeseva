import { z } from 'zod';

export const createTrackingSchema = z.object({
  body: z.object({
    applicationId: z.string().min(1),
    status: z.string().min(1),
    note: z.string().optional(),
  }),
});

export const applicationTrackingSchema = z.object({
  params: z.object({
    applicationId: z.string().min(1),
  }),
});