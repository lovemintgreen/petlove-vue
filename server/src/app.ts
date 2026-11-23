import 'dotenv/config';
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

app.get('/api/health', function (req, res) {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.get('/', function (req, res) {
  res.send('');
});

export default app;
