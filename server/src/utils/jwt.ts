import jwt, { type SignOptions } from 'jsonwebtoken';

export type UserRole = 'user' | 'admin';

export interface AuthPayload {
  userId: number;
  email: string;
  role: UserRole;
}

// 取得簽發與驗證 JWT 所需的密鑰，未設定時直接擲錯避免使用弱預設值
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

/**
 * 簽發包含使用者識別資訊與角色的 JWT（預設有效期 7 天）
 */
export function signToken(payload: AuthPayload): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

/**
 * 驗證 JWT 簽章與過期時間，並確保解碼欄位型別完整
 */
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
  const role: UserRole = decoded.role === 'admin' ? 'admin' : 'user';
  return {
    userId: decoded.userId,
    email: decoded.email,
    role
  };
}
