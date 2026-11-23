export interface ProductSpec {
  spec: string
  price: number
}

export interface Product {
  id: number
  category: string
  name: string
  image: string
  introduction: string
  specs: ProductSpec[]
  tastes: string[]
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
