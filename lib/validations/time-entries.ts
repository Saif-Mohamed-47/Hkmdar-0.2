import { z } from 'zod';

export const createTimeEntrySchema = z.object({
  case_id: z.string().trim().min(1, 'معرف القضية مطلوب'),
  description: z.string().trim().min(1, 'وصف العمل مطلوب'),
  duration_minutes: z.number({ message: 'مدة العمل يجب أن تكون رقماً' })
    .int('مدة العمل يجب أن تكون عدداً صحيحاً')
    .positive('مدة العمل يجب أن تكون أكبر من صفر'),
  hourly_rate: z.number({ message: 'أجر الساعة يجب أن يكون رقماً' })
    .min(0, 'أجر الساعة لا يمكن أن يكون سالباً'),
  date: z.string().trim().min(1, 'التاريخ مطلوب').refine((val) => !isNaN(Date.parse(val)), {
    message: 'التاريخ غير صالح',
  }),
});

export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>;
