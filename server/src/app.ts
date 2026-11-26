import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';

const app = express();

// 位於 Nginx 反向代理後方時正確識別來源 IP 與協定
app.set('trust proxy', 1);

// 從環境變數解析允許跨來源請求的前端網域白名單（支援逗號分隔）
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // 允許同源請求、curl、Docker Healthcheck 等未帶 Origin 的請求
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS 拒絕未授權來源：${origin}`));
    }
  })
);

// 解析 JSON 資料
app.use(express.json());
// 提供本機模式上傳的商品圖片靜態檔案（未設定 Cloudinary 時的退回方案）
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// 服務與資料庫連線健康檢查（供 Docker Healthcheck 與監控探針呼叫）
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    console.error('[GET /api/health]', err);
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// 掛載認證與商品模組路由
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.get('/', (_req, res) => {
  res.json({ name: 'PetLove API', status: 'running' });
});

export default app;
