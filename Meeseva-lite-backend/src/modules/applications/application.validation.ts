import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z
    .object({
      applicationType: z.string().min(1),
      title: z.string().min(1),
      payload: z.record(z.string(), z.unknown()).optional(),
    })
    .passthrough(),
});

export const updateApplicationSchema = z.object({
  params: z.object({
    applicationId: z.string().min(1),
  }),
  body: z
    .object({
      applicationType: z.string().min(1).optional(),
      title: z.string().min(1).optional(),
      status: z
        .enum(['draft', 'submitted', 'in_review', 'approved', 'rejected'])
        .optional(),
      payload: z.record(z.string(), z.unknown()).optional(),
    })
    .passthrough(),
});

export const applicationIdSchema = z.object({
  params: z.object({
    applicationId: z.string().min(1),
  }),
});
