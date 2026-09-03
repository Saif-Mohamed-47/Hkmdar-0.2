import { z } from 'zod';
import { LegalCategory } from '../types';

// Egyptian / Arab phone number regex or international format
const phoneRegex = /^(\+?[0-9]{1,4}[\s-]?)?([0-9]{9,14})$/;

/**
 * Schema for Login Form
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'يرجى إدخال البريد الإلكتروني')
    .email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z
    .string()
    .min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Base Schema for Registration
 */
export const baseRegisterSchema = z.object({
  fullName: z
    .string()
    .min(3, 'الاسم يجب أن يحتوي على 3 أحرف على الأقل')
    .max(100, 'الاسم طويل جداً'),
  email: z
    .string()
    .min(1, 'يرجى إدخال البريد الإلكتروني')
    .email('صيغة البريد الإلكتروني غير صحيحة'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: 'يرجى إدخال رقم هاتف صحيح (مثال: 01012345678 أو +20...)',
    }),
  password: z
    .string()
    .min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف')
    .max(100, 'كلمة المرور طويلة جداً'),
  location: z.string().default('القاهرة'),
  role: z.enum(['client', 'lawyer']),
  barNumber: z.string().optional(),
  specialty: z.string().optional(),
  agreeTerms: z.literal(true, {
    message: 'يجب الموافقة على شروط الاستخدام وميثاق سرية البيانات القضائية',
  }),
});

/**
 * Complete Registration Schema with conditional validation for Lawyer bar number & specialty
 */
export const registerSchema = baseRegisterSchema.superRefine((data, ctx) => {
  if (data.role === 'lawyer') {
    if (!data.barNumber || data.barNumber.trim().length < 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'رقم القيد بنقابة المحامين إلزامي للمحامي (4 خانات على الأقل)',
        path: ['barNumber'],
      });
    }
  }
});

export interface RegisterFormData {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  location: string;
  role: 'client' | 'lawyer';
  barNumber?: string;
  specialty?: LegalCategory;
  agreeTerms: boolean;
}
