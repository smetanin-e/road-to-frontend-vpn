import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, { message: 'Пароль должен содержать минимум 8 символов' });

export const loginSchema = z.object({
  login: z.string().min(2, { message: 'Введите логин' }),
  password: passwordSchema,
});

export type LoginFormType = z.infer<typeof loginSchema>;
