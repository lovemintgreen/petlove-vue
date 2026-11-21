import jwt, { type SignOptions } from 'jsonwebtoken';

export interface AuthPayload {
  userId: number;
  email: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

export function signToken(payload: AuthPayload): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

export function verifyToken(token: string): AuthPayload {
  const decoded = jwt.verify(token, getJwtSecret());
  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    typeof decoded.userId !== 'number' ||
    typeof decoded.email !== 'string'
  ) {
    throw new Error('Invalid token payload');
  }
  return {
    userId: decoded.userId,
    email: decoded.email
  };
}
