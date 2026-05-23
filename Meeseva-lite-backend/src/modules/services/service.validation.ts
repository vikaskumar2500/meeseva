import { z } from 'zod';

export const getServicesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
    category: z.string().optional(),
    department: z.string().optional(),
    tag: z.string().optional(),
  }),
});

export const searchServicesSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search query is required'),
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
  }),
});

export const getServiceByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Service ID must be a number'),
  }),
});

export const getPopularServicesSchema = z.object({
  query: z.object({
    limit: z.string().regex(/^\d+$/).optional().default('10'),
  }),
});

export const getCategoriesSchema = z.object({
  query: z.object({}).optional(),
});

export const getDepartmentsSchema = z.object({
  query: z.object({}).optional(),
});

export const getTagsSchema = z.object({
  query: z.object({}).optional(),
});
