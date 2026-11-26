import type { Request, Response, NextFunction } from 'express';
import type { RowDataPacket } from 'mysql2';
import { pool } from '../config/db.js';
import { verifyToken } from '../utils/jwt.js';

interface RoleRow extends RowDataPacket {
  role: string | null;
}

/**
 * 驗證 Authorization Bearer JWT，通過後將解碼資訊掛載至 req.user
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: '未提供驗證權杖（Authorization Bearer token）' });
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    res.status(401).json({ message: '驗證權杖格式錯誤' });
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: '驗證權杖無效或已過期' });
  }
}

/**
 * 驗證管理員權限：不直接信任 JWT 內的 role，而是即時查表確認，確保降權能立即生效
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: '請先登入' });
    return;
  }

  try {
    const [rows] = await pool.query<RoleRow[]>(
      'SELECT role FROM users WHERE user_id = ? LIMIT 1',
      [userId]
    );

    if (rows[0]?.role !== 'admin') {
      res.status(403).json({ message: '權限不足，僅管理員可執行此操作' });
      return;
    }

    if (req.user) {
      req.user.role = 'admin';
    }
    next();
  } catch (err) {
    console.error('[requireAdmin]', err);
    res.status(500).json({ message: '伺服器錯誤，無法驗證管理員權限' });
  }
}
