import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Order, Product } from '../types'

export interface DashboardData {
  totalProducts: number
  totalOrders: number
  salesValue: number
  lowStock: Product[]
  outOfStock: Product[]
  recentOrders: Order[]
  loading: boolean
}

export function useDashboard(): DashboardData {
  const [data, setData] = useState<Omit<DashboardData, 'loading'>>({
    totalProducts: 0,
    totalOrders: 0,
    salesValue: 0,
    lowStock: [],
    outOfStock: [],
    recentOrders: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      const [{ data: products }, { data: orders }] = await Promise.all([
        supabase.from('products').select('*'),
        supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8),
      ])

      if (!active) return

      const allProducts = (products ?? []) as Product[]
      const allOrders = (orders ?? []) as unknown as Order[]

      setData({
        totalProducts: allProducts.length,
        totalOrders: allOrders.length,
        salesValue: allOrders.reduce((sum, o) => sum + o.total, 0),
        lowStock: allProducts.filter(
          (p) => p.stock > 0 && p.stock <= p.minimum_stock
        ),
        outOfStock: allProducts.filter((p) => p.stock <= 0),
        recentOrders: allOrders,
      })
      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return { ...data, loading }
}
