import type { AuthPayload } from '../utils/jwt.js';

// 擴充 Express Request 型別，讓驗證中介軟體可安全掛載 req.user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};
