import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import type { NextFunction, Request, Response } from 'express';
import {
  deleteFromCloudinaryByUrl,
  isCloudinaryConfigured,
  uploadBufferToCloudinary
} from '../services/cloudinary.js';

const UPLOAD_SUBDIR = '/uploads/products/';
const PRODUCT_UPLOAD_DIR = path.resolve(process.cwd(), 'uploads', 'products');
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

// 使用記憶體暫存上傳檔案，待路由完成欄位與資料驗證後再寫入圖床或硬碟
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error('僅支援 JPG、PNG、WebP、GIF 圖片格式'));
      return;
    }
    cb(null, true);
  }
});

/**
 * 解析單張商品圖片（欄位名稱 productImg），並將 Multer 錯誤轉換為清楚的 400 回應
 */
export function uploadProductImage(req: Request, res: Response, next: NextFunction): void {
  upload.single('productImg')(req, res, (err: unknown) => {
    if (!err) {
      next();
      return;
    }

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ message: '圖片檔案過大，上限為 5MB' });
        return;
      }
      res.status(400).json({ message: `圖片上傳錯誤：${err.message}` });
      return;
    }

    const message = err instanceof Error ? err.message : '圖片上傳失敗';
    res.status(400).json({ message });
  });
}

/**
 * 持久化已驗證的圖片檔案：優先串流上傳至 Cloudinary，未設定憑證時退回本機硬碟
 */
export async function persistUploadedProductImage(file: Express.Multer.File): Promise<string> {
  if (isCloudinaryConfigured()) {
    return uploadBufferToCloudinary(file.buffer);
  }

  await fs.mkdir(PRODUCT_UPLOAD_DIR, { recursive: true });
  const rawExt = path.extname(file.originalname).toLowerCase();
  const safeExt = /^\.(jpe?g|png|webp|gif)$/.test(rawExt) ? rawExt : '.png';
  const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`;
  const fullPath = path.join(PRODUCT_UPLOAD_DIR, uniqueName);
  await fs.writeFile(fullPath, file.buffer);

  return `${UPLOAD_SUBDIR}${uniqueName}`;
}

/**
 * 清理不再使用的舊商品圖片（自動辨識 Cloudinary URL 或本機 /uploads/products/ 路徑）
 */
export async function deleteUploadedProductImage(
  imagePath: string | null | undefined
): Promise<void> {
  if (!imagePath) return;

  if (/^https?:\/\/res\.cloudinary\.com\//i.test(imagePath)) {
    await deleteFromCloudinaryByUrl(imagePath);
    return;
  }

  if (!imagePath.startsWith(UPLOAD_SUBDIR)) return;
  const filename = path.basename(imagePath);
  const fullPath = path.join(PRODUCT_UPLOAD_DIR, filename);

  try {
    await fs.unlink(fullPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code !== 'ENOENT') {
      console.error('[deleteUploadedProductImage]', err);
    }
  }
}
