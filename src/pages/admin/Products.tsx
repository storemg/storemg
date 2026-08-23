import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import type { Product } from '../../types'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts((data ?? []) as Product[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleActive(p: Product) {
    await supabase.from('products').update({ active: !p.active }).eq('id', p.id)
    load()
  }

  async function duplicate(p: Product) {
    const { id, created_at, updated_at, ...rest } = p
    await supabase.from('products').insert({ ...rest, name: `${p.name} (cópia)` })
    load()
  }

  async function remove(p: Product) {
    if (!confirm(`Excluir "${p.name}"? Essa ação não pode ser desfeita.`)) return
    await supabase.from('products').delete().eq('id', p.id)
    load()
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const money = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Produtos</h1>
          <p className="mt-1 text-sm text-white/50">
            {products.length} produto(s) cadastrado(s)
          </p>
        </div>
        <Link
          to="/admin/produtos/novo"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          + Novo produto
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar produto…"
        className="mb-4 w-full max-w-sm rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-ink-900 text-left text-xs uppercase text-white/40">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3">Destaque</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-ink-950">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-white/40">
                  Carregando…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-white/40">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-ink-800">
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <span>{p.name}</span>
                </td>
                <td className="px-4 py-3">
                  {p.promotional_price ? (
                    <span>
                      <span className="text-white/40 line-through">{money(p.price)}</span>{' '}
                      <span className="text-flare-400">{money(p.promotional_price)}</span>
                    </span>
                  ) : (
                    money(p.price)
                  )}
                </td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">{p.featured ? '★' : '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      p.active
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {p.active ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3 text-xs">
                    <Link to={`/admin/produtos/${p.id}`} className="text-brand-400 hover:underline">
                      Editar
                    </Link>
                    <button onClick={() => duplicate(p)} className="text-white/50 hover:text-white">
                      Duplicar
                    </button>
                    <button onClick={() => remove(p)} className="text-red-400 hover:text-red-300">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
