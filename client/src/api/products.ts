import request from './request'
import type {
  CategoriesResponse,
  Product,
  ProductDetailResponse,
  ProductListResponse,
  ProductQueryParams,
} from '@/types/shop'

export async function getCategoriesApi(): Promise<string[]> {
  const { data } = await request.get<CategoriesResponse>('/products/categories')
  return data.categories
}

export async function getProductsApi(params?: ProductQueryParams): Promise<ProductListResponse> {
  const { data } = await request.get<ProductListResponse>('/products', { params })
  return data
}

export async function getProductByIdApi(id: number): Promise<Product> {
  const { data } = await request.get<ProductDetailResponse>(`/products/${id}`)
  return data.product
}
