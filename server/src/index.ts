// 優先載入 .env 環境變數後再初始化 Express 應用
import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.PORT) || 3000;

// 啟動 HTTP 伺服器並監聽指定埠號
app.listen(port, function () {
  console.log(`Server running at http://localhost:${port}`);
});
