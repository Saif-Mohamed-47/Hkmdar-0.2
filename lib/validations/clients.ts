import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().trim().min(1, 'اسم الموكل مطلوب'),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  phone: z.string().trim().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
});

export const updateClientSchema = z.object({
  name: z.string().trim().min(1, 'اسم الموكل مطلوب').optional(),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  phone: z.string().trim().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
