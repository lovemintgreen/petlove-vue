import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import type { NextFunction, Request, Response } from 'express';

const UPLOAD_SUBDIR = '/uploads/products/';
const PRODUCT_UPLOAD_DIR = path.resolve(process.cwd(), 'uploads', 'products');
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

fs.mkdirSync(PRODUCT_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(PRODUCT_UPLOAD_DIR, { recursive: true });
    cb(null, PRODUCT_UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const rawExt = path.extname(file.originalname).toLowerCase();
    const safeExt = /^\.(jpe?g|png|webp|gif)$/.test(rawExt) ? rawExt : '.png';
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error('僅支援 JPG、PNG、WebP、GIF 圖片格式'));
      return;
    }
    cb(null, true);
  }
});

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

export function buildUploadedImageUrl(filename: string): string {
  return `${UPLOAD_SUBDIR}${filename}`;
}

export function deleteUploadedProductImage(imagePath: string | null | undefined): void {
  if (!imagePath || !imagePath.startsWith(UPLOAD_SUBDIR)) return;
  const filename = path.basename(imagePath);
  const fullPath = path.join(PRODUCT_UPLOAD_DIR, filename);

  fs.unlink(fullPath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('[deleteUploadedProductImage]', err);
    }
  });
}
