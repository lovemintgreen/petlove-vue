import { v2 as cloudinary } from 'cloudinary';

const DEFAULT_FOLDER = 'petlove/products';
let configured = false;

/**
 * 檢查是否已完整設定 Cloudinary 憑證，未設定時讓上傳流程退回本機儲存
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim()
  );
}

// 延遲初始化 Cloudinary SDK，避免未啟用圖床時在啟動期設定空白憑證
function ensureCloudinaryConfig(): void {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true
  });
  configured = true;
}

/**
 * 將記憶體 Buffer 串流上傳至 Cloudinary，並套用限寬 1200px 與自動格式／畫質最佳化
 */
export async function uploadBufferToCloudinary(buffer: Buffer): Promise<string> {
  ensureCloudinaryConfig();
  const folder = process.env.CLOUDINARY_FOLDER?.trim() || DEFAULT_FOLDER;

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error('Cloudinary 未回傳圖片網址'));
          return;
        }
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

/**
 * 從 Cloudinary secure_url 解析出刪除所需的 public_id（忽略轉換參數與版本號前綴）
 */
export function extractCloudinaryPublicId(imageUrl: string): string | null {
  try {
    const parsed = new URL(imageUrl);
    if (!parsed.hostname.endsWith('res.cloudinary.com')) return null;

    const uploadMarker = '/image/upload/';
    const markerIndex = parsed.pathname.indexOf(uploadMarker);
    if (markerIndex === -1) return null;

    let remainder = parsed.pathname.slice(markerIndex + uploadMarker.length);
    const segments = remainder.split('/').filter(Boolean);

    // 移除選用的版本號前綴（例如 v1730000000）或轉換參數段
    const versionIdx = segments.findIndex((seg) => /^v\d+$/.test(seg));
    const publicSegments = versionIdx >= 0 ? segments.slice(versionIdx + 1) : segments;
    if (publicSegments.length === 0) return null;

    remainder = decodeURIComponent(publicSegments.join('/'));
    const withoutExt = remainder.replace(/\.[^/.]+$/, '');
    return withoutExt || null;
  } catch {
    return null;
  }
}

export async function deleteFromCloudinaryByUrl(imageUrl: string): Promise<void> {
  if (!isCloudinaryConfigured()) return;
  const publicId = extractCloudinaryPublicId(imageUrl);
  if (!publicId) return;

  ensureCloudinaryConfig();
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (err) {
    console.error('[deleteFromCloudinaryByUrl]', err);
  }
}
