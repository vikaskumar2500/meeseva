import { z } from 'zod';

export const uploadDocumentSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Document name is required'),
    type: z.enum([
      'aadhaar',
      'pan',
      'passport',
      'license',
      'certificate',
      'other',
    ]),
    issuer: z.string().min(1, 'Issuer is required'),
    issueDate: z.string().datetime().optional(),
    expiryDate: z.string().datetime().optional(),
    documentNumber: z.string().min(1, 'Document number is required'),
  }),
});

export const getDocumentsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
    status: z.enum(['pending', 'verified', 'rejected']).optional(),
  }),
});

export const getDocumentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Document ID is required'),
  }),
});

export const updateDocumentVerificationSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'verified', 'rejected']),
    remarks: z.string().optional(),
  }),
});

export const updateExtractedDataSchema = z.object({
  body: z.object({
    extractedData: z.record(z.string(), z.unknown()),
  }),
});
