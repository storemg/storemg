export type ProductStatus = 'active' | 'inactive'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  promotional_price: number | null
  stock: number
  minimum_stock: number
  category_id: string | null
  brand: string | null
  images: string[]
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  active: boolean
  created_at: string
}

export type OrderStatus =
  | 'pendente'
  | 'confirmado'
  | 'preparando'
  | 'enviado'
  | 'entregue'
  | 'cancelado'

export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  items: OrderItem[]
  total: number
  payment_method: string
  status: OrderStatus
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export function stockLabel(stock: number, minimumStock: number) {
  if (stock <= 0) return { text: 'Esgotado', tone: 'danger' as const }
  if (stock <= minimumStock) return { text: 'Últimas unidades', tone: 'warning' as const }
  return { text: 'Em estoque', tone: 'ok' as const }
}
