import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { Product } from '../../types'
import { stockLabel } from '../../types'

export default function Stock() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Record<string, number>>({})

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('stock')
    setProducts((data ?? []) as Product[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function saveStock(productId: string) {
    const value = editing[productId]
    if (value === undefined) return
    await supabase.from('products').update({ stock: value }).eq('id', productId)
    setEditing((e) => {
      const next = { ...e }
      delete next[productId]
      return next
    })
    load()
  }

  const tone = {
    ok: 'bg-emerald-500/15 text-emerald-400',
    warning: 'bg-flare-500/15 text-flare-400',
    danger: 'bg-red-500/15 text-red-400',
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Estoque</h1>
      <p className="mt-1 text-sm text-white/50">
        Altere a quantidade manualmente e clique em salvar. O status muda automaticamente.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-ink-900 text-left text-xs uppercase text-white/40">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Estoque atual</th>
              <th className="px-4 py-3">Mínimo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Alterar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-ink-950">
            {!loading &&
              products.map((p) => {
                const label = stockLabel(p.stock, p.minimum_stock)
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3 text-white/50">{p.minimum_stock}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs ${tone[label.tone]}`}>
                        {label.text}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={p.stock}
                          onChange={(e) =>
                            setEditing((ed) => ({ ...ed, [p.id]: parseInt(e.target.value) }))
                          }
                          className="w-20 rounded-lg border border-white/10 bg-ink-900 px-2 py-1 text-sm outline-none focus:border-brand-500"
                        />
                        <button
                          onClick={() => saveStock(p.id)}
                          disabled={editing[p.id] === undefined}
                          className="rounded-lg bg-brand-500 px-3 py-1 text-xs font-semibold text-white disabled:opacity-30"
                        >
                          Salvar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
