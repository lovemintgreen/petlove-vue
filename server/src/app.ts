import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173'
    //  credentials: true  / 如使用cookie、session補上
  })
);
// 解析json資料
app.use(express.json());
// 提供上傳的商品圖片靜態檔案
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/api/health', function (req, res) {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.get('/', function (req, res) {
  res.send('');
});

export default app;
