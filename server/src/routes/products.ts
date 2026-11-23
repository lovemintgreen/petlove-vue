import { Router, type Request, type Response } from 'express';
import type { RowDataPacket } from 'mysql2';
import { pool } from '../config/db.js';

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

// GET /api/products/categories
router.get('/categories', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<CategoryRow[]>(
      'SELECT DISTINCT category FROM product ORDER BY MIN(product_id) ASC'
    ).catch(async () => {
      // 相容 ONLY_FULL_GROUP_BY 嚴格模式
      return pool.query<CategoryRow[]>(
        'SELECT category FROM product GROUP BY category ORDER BY MIN(product_id) ASC'
      );
    });

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

    const productId = Number(rawId);

    const [productRows] = await pool.query<ProductRow[]>(
      `SELECT product_id, category, product_name, product_img, product_stock, introduction
       FROM product
       WHERE product_id = ?
       LIMIT 1`,
      [productId]
    );

    if (productRows.length === 0) {
      res.status(404).json({ message: '找不到此商品' });
      return;
    }

    const [specRows] = await pool.query<ProductSpecRow[]>(
      `SELECT spec_id, product_id, specifications, taste, price
       FROM product_spec
       WHERE product_id = ?
       ORDER BY price ASC, spec_id ASC`,
      [productId]
    );

    const [product] = assembleProducts(productRows, specRows);
    res.json({ product });
  } catch (err) {
    console.error('[GET /api/products/:id]', err);
    res.status(500).json({ message: '伺服器錯誤，無法取得商品詳情' });
  }
});

export default router;
