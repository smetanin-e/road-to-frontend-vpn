import z from 'zod';

export const subscriptionSchema = z.object({
  name: z.string().min(4, { message: 'Введите название подписки' }),
  description: z.string().min(10, { message: 'Введите описание' }),
  dailyPrice: z.string().regex(/^[1-9][0-9]*$/, {
    message: 'Введите корректные данные',
  }),
  maxPeers: z.string().regex(/^[1-9][0-9]*$/, {
    message: 'Введите корректные данные',
  }),
});
export type SubscriptionFormType = z.infer<typeof subscriptionSchema>;
