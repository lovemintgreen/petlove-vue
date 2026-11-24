import { Router, type Request, type Response } from 'express';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/db.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.js';
import {
  buildUploadedImageUrl,
  deleteUploadedProductImage,
  uploadProductImage
} from '../middlewares/upload.js';

const router = Router();

interface CategoryRow extends RowDataPacket {
  category: string;
}

interface CountRow extends RowDataPacket {
  total: number;
}

interface ProductRow extends RowDataPacket {
  product_id: number;
  category: string;
  product_name: string;
  product_img: string;
  product_stock: number;
  introduction: string | null;
}

interface ProductImageRow extends RowDataPacket {
  product_img: string;
}

interface ProductSpecRow extends RowDataPacket {
  spec_id: number;
  product_id: number;
  specifications: string;
  taste: string | null;
  price: number;
}

interface FormattedProductSpec {
  specId: number;
  spec: string;
  taste: string;
  price: number;
}

interface FormattedProduct {
  id: number;
  category: string;
  name: string;
  image: string;
  stock: number;
  introduction: string;
  specs: FormattedProductSpec[];
  tastes: string[];
  minPrice: number;
  maxPrice: number;
}

interface SpecInput {
  spec: string;
  taste: string;
  price: number;
}

function assembleProducts(
  productRows: ProductRow[],
  specRows: ProductSpecRow[]
): FormattedProduct[] {
  const specsByProductId = new Map<number, FormattedProductSpec[]>();

  for (const row of specRows) {
    const list = specsByProductId.get(row.product_id) ?? [];
    list.push({
      specId: row.spec_id,
      spec: row.specifications,
      taste: (row.taste ?? '').trim(),
      price: Number(row.price)
    });
    specsByProductId.set(row.product_id, list);
  }

  return productRows.map((product) => {
    const specs = specsByProductId.get(product.product_id) ?? [];
    const tastes = Array.from(
      new Set(specs.map((item) => item.taste).filter((taste) => taste.length > 0))
    );
    const prices = specs.map((item) => item.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      id: product.product_id,
      category: product.category,
      name: product.product_name,
      image: product.product_img,
      stock: Number(product.product_stock),
      introduction: product.introduction ?? '',
      specs,
      tastes,
      minPrice,
      maxPrice
    };
  });
}

function parseSpecsInput(rawSpecs: unknown): { specs?: SpecInput[]; error?: string } {
  let parsed: unknown = rawSpecs;

  if (typeof rawSpecs === 'string') {
    try {
      parsed = JSON.parse(rawSpecs);
    } catch {
      return { error: '商品規格格式錯誤（非有效 JSON）' };
    }
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { error: '請至少新增一組商品規格與價格' };
  }

  const normalized: SpecInput[] = [];
  for (const item of parsed) {
    if (typeof item !== 'object' || item === null) {
      return { error: '商品規格資料格式錯誤' };
    }
    const record = item as Record<string, unknown>;
    const spec = typeof record.spec === 'string' ? record.spec.trim() : '';
    const taste = typeof record.taste === 'string' ? record.taste.trim() : '';
    const price = Number(record.price);

    if (!spec) {
      return { error: '每組規格名稱皆為必填' };
    }
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(price)) {
      return { error: '商品價格必須為 0 以上的整數' };
    }

    normalized.push({ spec, taste, price });
  }

  return { specs: normalized };
}

function parseProductPayload(body: Record<string, unknown>) {
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const introduction =
    typeof body.introduction === 'string' ? body.introduction.trim() : '';
  const stock = Number(body.stock ?? 0);

  if (!category) {
    return { error: '請填寫商品分類' };
  }
  if (!name) {
    return { error: '請填寫商品名稱' };
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return { error: '庫存數量必須為 0 以上的整數' };
  }

  const { specs, error: specsError } = parseSpecsInput(body.specs);
  if (specsError || !specs) {
    return { error: specsError ?? '商品規格資料錯誤' };
  }

  return {
    data: {
      category,
      name,
      stock,
      introduction,
      specs
    }
  };
}

async function fetchFormattedProductById(productId: number): Promise<FormattedProduct | null> {
  const [productRows] = await pool.query<ProductRow[]>(
    `SELECT product_id, category, product_name, product_img, product_stock, introduction
     FROM product
     WHERE product_id = ?
     LIMIT 1`,
    [productId]
  );

  if (productRows.length === 0) return null;

  const [specRows] = await pool.query<ProductSpecRow[]>(
    `SELECT spec_id, product_id, specifications, taste, price
     FROM product_spec
     WHERE product_id = ?
     ORDER BY price ASC, spec_id ASC`,
    [productId]
  );

  const [product] = assembleProducts(productRows, specRows);
  return product ?? null;
}

// GET /api/products/categories
router.get('/categories', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool
      .query<CategoryRow[]>(
        'SELECT category FROM product GROUP BY category ORDER BY MIN(product_id) ASC'
      );

    res.json({
      categories: rows.map((row) => row.category)
    });
  } catch (err) {
    console.error('[GET /api/products/categories]', err);
    res.status(500).json({ message: '伺服器錯誤，無法取得商品分類' });
  }
});

// GET /api/products?category=&keyword=&page=1&limit=6
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const category =
      typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const keyword =
      typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';

    const parsedPage = Number.parseInt(String(req.query.page ?? '1'), 10);
    const parsedLimit = Number.parseInt(String(req.query.limit ?? '6'), 10);
    const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
    const limit =
      Number.isNaN(parsedLimit) || parsedLimit < 1 ? 6 : Math.min(parsedLimit, 50);

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (keyword) {
      conditions.push('(product_name LIKE ? OR introduction LIKE ?)');
      const likePattern = `%${keyword}%`;
      params.push(likePattern, likePattern);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countRows] = await pool.query<CountRow[]>(
      `SELECT COUNT(*) AS total FROM product ${whereClause}`,
      params
    );
    const total = Number(countRows[0]?.total ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * limit;

    if (total === 0) {
      res.json({
        data: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 1
        }
      });
      return;
    }

    const [productRows] = await pool.query<ProductRow[]>(
      `SELECT product_id, category, product_name, product_img, product_stock, introduction
       FROM product
       ${whereClause}
       ORDER BY product_id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const productIds = productRows.map((row) => row.product_id);
    const [specRows] =
      productIds.length > 0
        ? await pool.query<ProductSpecRow[]>(
            `SELECT spec_id, product_id, specifications, taste, price
             FROM product_spec
             WHERE product_id IN (?)
             ORDER BY price ASC, spec_id ASC`,
            [productIds]
          )
        : [[] as ProductSpecRow[]];

    res.json({
      data: assembleProducts(productRows, specRows),
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error('[GET /api/products]', err);
    res.status(500).json({ message: '伺服器錯誤，無法取得商品列表' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    if (typeof rawId !== 'string' || !/^\d+$/.test(rawId)) {
      res.status(400).json({ message: '無效的商品編號' });
      return;
    }

    const product = await fetchFormattedProductById(Number(rawId));
    if (!product) {
      res.status(404).json({ message: '找不到此商品' });
      return;
    }

    res.json({ product });
  } catch (err) {
    console.error('[GET /api/products/:id]', err);
    res.status(500).json({ message: '伺服器錯誤，無法取得商品詳情' });
  }
});

// POST /api/products (管理員上架新商品)
router.post(
  '/',
  requireAuth,
  requireAdmin,
  uploadProductImage,
  async (req: Request, res: Response): Promise<void> => {
    const uploadedPath = req.file ? buildUploadedImageUrl(req.file.filename) : null;
    const body = (req.body ?? {}) as Record<string, unknown>;
    const parsed = parseProductPayload(body);

    if (parsed.error || !parsed.data) {
      deleteUploadedProductImage(uploadedPath);
      res.status(400).json({ message: parsed.error ?? '商品資料驗證失敗' });
      return;
    }

    const fallbackImage = typeof body.image === 'string' ? body.image.trim() : '';
    const productImg = uploadedPath ?? fallbackImage;

    if (!productImg) {
      res.status(400).json({ message: '請上傳商品圖片' });
      return;
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [insertResult] = await conn.execute<ResultSetHeader>(
        `INSERT INTO product (category, product_name, product_img, product_stock, introduction)
         VALUES (?, ?, ?, ?, ?)`,
        [
          parsed.data.category,
          parsed.data.name,
          productImg,
          parsed.data.stock,
          parsed.data.introduction
        ]
      );

      const newProductId = insertResult.insertId;
      const specValues = parsed.data.specs.map((item) => [
        newProductId,
        item.spec,
        item.taste,
        item.price
      ]);

      await conn.query(
        'INSERT INTO product_spec (product_id, specifications, taste, price) VALUES ?',
        [specValues]
      );

      await conn.commit();

      const product = await fetchFormattedProductById(newProductId);
      res.status(201).json({ message: '商品上架成功', product });
    } catch (err) {
      await conn.rollback();
      deleteUploadedProductImage(uploadedPath);
      console.error('[POST /api/products]', err);
      res.status(500).json({ message: '伺服器錯誤，商品上架失敗' });
    } finally {
      conn.release();
    }
  }
);

// PUT /api/products/:id (管理員編輯商品與規格)
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  uploadProductImage,
  async (req: Request, res: Response): Promise<void> => {
    const uploadedPath = req.file ? buildUploadedImageUrl(req.file.filename) : null;
    const rawId = req.params.id;

    if (typeof rawId !== 'string' || !/^\d+$/.test(rawId)) {
      deleteUploadedProductImage(uploadedPath);
      res.status(400).json({ message: '無效的商品編號' });
      return;
    }

    const productId = Number(rawId);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const parsed = parseProductPayload(body);

    if (parsed.error || !parsed.data) {
      deleteUploadedProductImage(uploadedPath);
      res.status(400).json({ message: parsed.error ?? '商品資料驗證失敗' });
      return;
    }

    const conn = await pool.getConnection();
    let oldImageToDelete: string | null = null;

    try {
      await conn.beginTransaction();

      const [existingRows] = await conn.query<ProductImageRow[]>(
        'SELECT product_img FROM product WHERE product_id = ? LIMIT 1',
        [productId]
      );

      if (existingRows.length === 0) {
        await conn.rollback();
        deleteUploadedProductImage(uploadedPath);
        res.status(404).json({ message: '找不到此商品' });
        return;
      }

      const currentImg = existingRows[0]?.product_img ?? '';
      const nextImg = uploadedPath ?? currentImg;

      if (uploadedPath && currentImg && currentImg !== uploadedPath) {
        oldImageToDelete = currentImg;
      }

      await conn.execute(
        `UPDATE product
         SET category = ?, product_name = ?, product_img = ?, product_stock = ?, introduction = ?
         WHERE product_id = ?`,
        [
          parsed.data.category,
          parsed.data.name,
          nextImg,
          parsed.data.stock,
          parsed.data.introduction,
          productId
        ]
      );

      await conn.execute('DELETE FROM product_spec WHERE product_id = ?', [productId]);

      const specValues = parsed.data.specs.map((item) => [
        productId,
        item.spec,
        item.taste,
        item.price
      ]);

      await conn.query(
        'INSERT INTO product_spec (product_id, specifications, taste, price) VALUES ?',
        [specValues]
      );

      await conn.commit();

      if (oldImageToDelete) {
        deleteUploadedProductImage(oldImageToDelete);
      }

      const product = await fetchFormattedProductById(productId);
      res.json({ message: '商品更新成功', product });
    } catch (err) {
      await conn.rollback();
      deleteUploadedProductImage(uploadedPath);
      console.error('[PUT /api/products/:id]', err);
      res.status(500).json({ message: '伺服器錯誤，商品更新失敗' });
    } finally {
      conn.release();
    }
  }
);

// DELETE /api/products/:id (管理員刪除商品)
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const rawId = req.params.id;
    if (typeof rawId !== 'string' || !/^\d+$/.test(rawId)) {
      res.status(400).json({ message: '無效的商品編號' });
      return;
    }

    const productId = Number(rawId);

    try {
      const [existingRows] = await pool.query<ProductImageRow[]>(
        'SELECT product_img FROM product WHERE product_id = ? LIMIT 1',
        [productId]
      );

      if (existingRows.length === 0) {
        res.status(404).json({ message: '找不到此商品' });
        return;
      }

      const oldImg = existingRows[0]?.product_img;

      await pool.execute('DELETE FROM product WHERE product_id = ?', [productId]);
      deleteUploadedProductImage(oldImg);

      res.json({ message: '商品已刪除', id: productId });
    } catch (err) {
      console.error('[DELETE /api/products/:id]', err);
      res.status(500).json({ message: '伺服器錯誤，商品刪除失敗' });
    }
  }
);

export default router;
