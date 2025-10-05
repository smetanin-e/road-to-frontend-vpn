import { updateUserDetails } from '@/shared/lib/update-user-details';
import { createUserSchema } from '@/shared/schemas/create-user-schema';
import { createUser } from '@/shared/services/auth/auth-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Невалидные данные' }, { status: 400 });
    }

    const user = await createUser(result.data);
    await updateUserDetails(user.id);
    return user;
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return NextResponse.json({ error: 'Что-то пошло не так' }, { status: 500 });
  }
}
