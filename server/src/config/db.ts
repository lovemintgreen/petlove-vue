import mysql from 'mysql2/promise';

// 雲端託管 MySQL（如 Aiven、TiDB）通常強制要求啟用 TLS/SSL 連線
const useSsl = process.env.DB_SSL === 'true';

// 建立全域共用的 MySQL 連線池，避免每次查詢重複建立 TCP 連線
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // 等待可用連線
  connectionLimit: 10,
  ...(useSsl
    ? {
        ssl: {
          rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
        }
      }
    : {})
});
