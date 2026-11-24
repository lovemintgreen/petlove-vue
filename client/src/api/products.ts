import request from './request'
import type {
  CategoriesResponse,
  Product,
  ProductDetailResponse,
  ProductListResponse,
  ProductQueryParams,
} from '@/types/shop'

interface ProductMutationResponse {
  message: string
  product: Product
}

interface ProductDeleteResponse {
  message: string
  id: number
}

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

export async function createProductApi(formData: FormData): Promise<Product> {
  const { data } = await request.post<ProductMutationResponse>('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.product
}

export async function updateProductApi(id: number, formData: FormData): Promise<Product> {
  const { data } = await request.put<ProductMutationResponse>(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.product
}

export async function deleteProductApi(id: number): Promise<ProductDeleteResponse> {
  const { data } = await request.delete<ProductDeleteResponse>(`/products/${id}`)
  return data
}
