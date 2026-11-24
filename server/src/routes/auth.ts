import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/db.js';
import { requireAuth } from '../middlewares/auth.js';
import { signToken, type UserRole } from '../utils/jwt.js';

const router = Router();
const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface UserRow extends RowDataPacket {
  user_id: number;
  user_name: string;
  user_phone: string | null;
  user_mail: string;
  user_password: string;
  role: string | null;
}

interface PublicUserRow extends RowDataPacket {
  user_id: number;
  user_name: string;
  user_phone: string | null;
  user_mail: string;
  role: string | null;
}

interface ExistingUserRow extends RowDataPacket {
  user_id: number;
}

function normalizeRole(role?: string | null): UserRole {
  return role === 'admin' ? 'admin' : 'user';
}

function formatUser(
  row: Pick<PublicUserRow, 'user_id' | 'user_name' | 'user_phone' | 'user_mail' | 'role'>
) {
  return {
    id: row.user_id,
    name: row.user_name,
    phone: row.user_phone ?? '',
    email: row.user_mail,
    role: normalizeRole(row.role)
  };
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, password } = req.body ?? {};

    if (typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ message: '請填寫用戶名稱' });
      return;
    }

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      res.status(400).json({ message: '請填寫有效的電子郵件' });
      return;
    }

    if (typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ message: '密碼長度至少需 6 個字元' });
      return;
    }

    if (phone !== undefined && phone !== null && typeof phone !== 'string') {
      res.status(400).json({ message: '手機號碼格式錯誤' });
      return;
    }

    const trimmedName = name.trim();
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
    const normalizedEmail = email.trim().toLowerCase();

    const [existing] = await pool.query<ExistingUserRow[]>(
      'SELECT user_id FROM users WHERE user_mail = ? LIMIT 1',
      [normalizedEmail]
    );

    if (existing.length > 0) {
      res.status(409).json({ message: '此電子郵件已被註冊' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const defaultRole: UserRole = 'user';

    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (user_name, user_phone, user_mail, user_password, role) VALUES (?, ?, ?, ?, ?)',
      [trimmedName, trimmedPhone, normalizedEmail, passwordHash, defaultRole]
    );

    const userId = result.insertId;
    const token = signToken({ userId, email: normalizedEmail, role: defaultRole });

    res.status(201).json({
      token,
      user: {
        id: userId,
        name: trimmedName,
        phone: trimmedPhone,
        email: normalizedEmail,
        role: defaultRole
      }
    });
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code?: string }).code === 'ER_DUP_ENTRY'
    ) {
      res.status(409).json({ message: '此電子郵件已被註冊' });
      return;
    }
    console.error('[POST /api/auth/register]', err);
    res.status(500).json({ message: '伺服器錯誤，註冊失敗' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      res.status(400).json({ message: '請填寫電子郵件與密碼' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [rows] = await pool.query<UserRow[]>(
      'SELECT user_id, user_name, user_phone, user_mail, user_password, role FROM users WHERE user_mail = ? LIMIT 1',
      [normalizedEmail]
    );

    const user = rows[0];

    if (!user) {
      res.status(401).json({ message: '電子郵件或密碼錯誤' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.user_password);

    if (!isMatch) {
      res.status(401).json({ message: '電子郵件或密碼錯誤' });
      return;
    }

    const role = normalizeRole(user.role);
    const token = signToken({ userId: user.user_id, email: user.user_mail, role });

    res.status(200).json({
      token,
      user: formatUser(user)
    });
  } catch (err) {
    console.error('[POST /api/auth/login]', err);
    res.status(500).json({ message: '伺服器錯誤，登入失敗' });
  }
});

// GET /api/auth/me
router.get(
  '/me',
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: '未通過驗證' });
        return;
      }

      const [rows] = await pool.query<PublicUserRow[]>(
        'SELECT user_id, user_name, user_phone, user_mail, role FROM users WHERE user_id = ? LIMIT 1',
        [userId]
      );

      const user = rows[0];
      if (!user) {
        res.status(404).json({ message: '找不到使用者' });
        return;
      }

      res.status(200).json({
        user: formatUser(user)
      });
    } catch (err) {
      console.error('[GET /api/auth/me]', err);
      res.status(500).json({ message: '伺服器錯誤，無法取得使用者資料' });
    }
  }
);

export default router;
