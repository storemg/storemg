import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { Order, OrderStatus } from '../../types'

const STATUSES: OrderStatus[] = [
  'pendente',
  'confirmado',
  'preparando',
  'enviado',
  'entregue',
  'cancelado',
]

const STATUS_TONE: Record<OrderStatus, string> = {
  pendente: 'bg-white/10 text-white/60',
  confirmado: 'bg-brand-500/15 text-brand-400',
  preparando: 'bg-flare-500/15 text-flare-400',
  enviado: 'bg-purple-500/15 text-purple-300',
  entregue: 'bg-emerald-500/15 text-emerald-400',
  cancelado: 'bg-red-500/15 text-red-400',
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders((data ?? []) as unknown as Order[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  // Quando um pedido é marcado como "confirmado", baixamos o estoque
  // de cada item automaticamente — item 6 do briefing.
  async function updateStatus(order: Order, status: OrderStatus) {
    await supabase.from('orders').update({ status }).eq('id', order.id)

    if (status === 'confirmado') {
      for (const item of order.items) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single()
        if (product) {
          await supabase
            .from('products')
            .update({ stock: Math.max(0, product.stock - item.quantity) })
            .eq('id', item.product_id)
        }
      }
    }

    load()
  }

  const money = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Pedidos</h1>
      <p className="mt-1 text-sm text-white/50">{orders.length} pedido(s)</p>

      <div className="mt-6 space-y-3">
        {!loading && orders.length === 0 && (
          <p className="text-sm text-white/40">Nenhum pedido ainda.</p>
        )}

        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-white/10 bg-ink-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{o.customer_name}</p>
                <p className="text-xs text-white/40">
                  {o.customer_phone} · {new Date(o.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display font-semibold">{money(o.total)}</span>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o, e.target.value as OrderStatus)}
                  className={`rounded-full border-none px-2.5 py-1 text-xs font-medium outline-none ${STATUS_TONE[o.status]}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-ink-900 text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ul className="mt-3 space-y-1 border-t border-white/5 pt-3 text-sm text-white/60">
              {o.items.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>{money(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
