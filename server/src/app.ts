import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173'
    //  credentials: true  / 如使用cookie、session補上
  })
);
// 解析json資料
app.use(express.json());

app.get('/', function (req, res) {
  res.send('');
});

export default app;
