import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/db.js';
import { requireAuth } from '../middlewares/auth.js';
import { signToken, type UserRole } from '../utils/jwt.js';

const router = Router();
// bcrypt 加鹽成本因子與基本 Email 格式檢核
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

// 僅允許 'admin' 角色通過，其餘一律正規化為預設一般會員 'user'
function normalizeRole(role?: string | null): UserRole {
  return role === 'admin' ? 'admin' : 'user';
}

// 過濾 user_password 等敏感欄位，僅回傳前端所需的公開使用者資料
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

// POST /api/auth/register：會員註冊，驗證欄位後進行 bcrypt 雜湊並簽發 JWT
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
    // 註冊一律強制指派為一般會員，防止前端傳參越權提權
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
    // 處理併發註冊時觸發的資料庫 UNIQUE 索引衝突
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

// POST /api/auth/login：驗證信箱與 bcrypt 密碼雜湊，成功後核發 JWT
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

// GET /api/auth/me：透過 Bearer Token 取得當前登入使用者的最新非敏感資料
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
