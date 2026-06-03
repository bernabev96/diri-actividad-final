import { z } from 'zod';

export function getTodayDateValue(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const loginSchema = z.object({
  email: z.string().email('validation.email'),
  password: z.string().min(6, 'validation.passwordMin'),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'validation.nameMin'),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'validation.nameMin'),
  phone: z.string().max(20, 'validation.phoneMax'),
});

export const classSessionSchema = z.object({
  title: z.string().min(2, 'validation.classTitleMin'),
  trainer: z.string().min(2, 'validation.trainerMin'),
  date: z.string().min(1, 'validation.required').refine((date) => date >= getTodayDateValue(), 'validation.classDatePast'),
  time: z.string().min(1, 'validation.required'),
  capacity: z.number().min(1, 'validation.capacityMin'),
  active: z.boolean(),
});

export const userSearchSchema = z.object({
  email: z.string().min(1, 'validation.required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ClassSessionFormValues = z.infer<typeof classSessionSchema>;
export type UserSearchFormValues = z.infer<typeof userSearchSchema>;
