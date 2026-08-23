import { Link } from 'react-router-dom'
import { useDashboard } from '../../hooks/useDashboard'

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900 p-5">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const d = useDashboard()

  const money = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">Visão geral da loja em tempo real</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total de produtos" value={d.loading ? '…' : d.totalProducts} />
        <StatCard label="Total de pedidos" value={d.loading ? '…' : d.totalOrders} />
        <StatCard label="Valor em vendas" value={d.loading ? '…' : money(d.salesValue)} />
        <StatCard
          label="Estoque baixo / esgotado"
          value={d.loading ? '…' : `${d.lowStock.length} / ${d.outOfStock.length}`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink-900 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold">Pedidos recentes</h2>
            <Link to="/admin/pedidos" className="text-xs text-brand-400 hover:underline">
              Ver todos
            </Link>
          </div>
          {d.recentOrders.length === 0 && !d.loading && (
            <p className="text-sm text-white/40">Nenhum pedido ainda.</p>
          )}
          <ul className="space-y-2">
            {d.recentOrders.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between rounded-lg bg-ink-800 px-3 py-2 text-sm"
              >
                <span>{o.customer_name}</span>
                <span className="text-white/50">{money(o.total)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-900 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold">Estoque baixo</h2>
            <Link to="/admin/estoque" className="text-xs text-brand-400 hover:underline">
              Gerenciar estoque
            </Link>
          </div>
          {d.lowStock.length === 0 && !d.loading && (
            <p className="text-sm text-white/40">Nenhum produto com estoque baixo.</p>
          )}
          <ul className="space-y-2">
            {d.lowStock.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-ink-800 px-3 py-2 text-sm"
              >
                <span>{p.name}</span>
                <span className="text-flare-400">{p.stock} un.</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
