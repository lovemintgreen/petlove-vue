export interface ProductSpec {
  specId?: number
  spec: string
  taste?: string
  price: number
}

export interface Product {
  id: number
  category: string
  name: string
  image: string
  stock: number
  introduction: string
  specs: ProductSpec[]
  tastes: string[]
  minPrice: number
  maxPrice: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ProductListResponse {
  data: Product[]
  pagination: PaginationMeta
}

export interface CategoriesResponse {
  categories: string[]
}

export interface ProductDetailResponse {
  product: Product
}

export interface ProductQueryParams {
  category?: string
  keyword?: string
  page?: number
  limit?: number
}

export interface CartItem {
  key: string
  productId: number
  productImg: string
  productName: string
  productSpec: string
  taste: string
  unitPrice: number
  quantity: number
}
