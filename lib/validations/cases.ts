import { z } from 'zod';

export const caseStatusEnum = z.enum(['active', 'pending', 'closed'], {
  message: 'حالة القضية غير صالحة (active, pending, closed)',
});

export const createCaseSchema = z.object({
  client_id: z.string().trim().min(1, 'معرف الموكل مطلوب'),
  title: z.string().trim().min(1, 'عنوان القضية مطلوب'),
  status: caseStatusEnum,
  case_number: z.string().trim().optional().or(z.literal('')),
  court: z.string().trim().optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),
});

export const updateCaseSchema = z.object({
  title: z.string().trim().min(1, 'عنوان القضية مطلوب').optional(),
  status: caseStatusEnum.optional(),
  case_number: z.string().trim().optional().or(z.literal('')),
  court: z.string().trim().optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;
