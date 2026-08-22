import { z } from 'zod';

export const invoiceStatusEnum = z.enum(['draft', 'sent', 'paid'], {
  message: 'حالة الفاتورة غير صالحة (draft, sent, paid)',
});

export const createInvoiceSchema = z.object({
  case_id: z.string().trim().min(1, 'معرف القضية مطلوب'),
  status: invoiceStatusEnum.optional().default('draft'),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
