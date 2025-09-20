import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRole } from '@prisma/client';
const JWT_SECRET = process.env.JWT_SECRET!;

//Генерация Access токена
export function generateAccessToken(payload: { userId: number; role: UserRole }) {
  if (!JWT_SECRET) {
    throw new Error('❌ JWT_SECRET is undefined! Убедись, что он задан в .env');
  }

  const token = jwt.sign(
    {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID(),
    },
    JWT_SECRET,
    { expiresIn: '15m' },
  );
  return token;
}

//Генерация Refresh токена
export function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex').normalize();
}
