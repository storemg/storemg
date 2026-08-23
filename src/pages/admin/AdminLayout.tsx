import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true, icon: '◧' },
  { to: '/admin/produtos', label: 'Produtos', icon: '◫' },
  { to: '/admin/estoque', label: 'Estoque', icon: '▤' },
  { to: '/admin/pedidos', label: 'Pedidos', icon: '▣' },
  { to: '/admin/categorias', label: 'Categorias', icon: '▥' },
  { to: '/admin/configuracoes', label: 'Configurações', icon: '◍' },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen bg-ink-950 text-white">
      <aside className="flex w-64 flex-col border-r border-white/10 bg-ink-900 px-4 py-6">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-flare-500 font-display text-sm font-bold text-ink-950">
            MG
          </div>
          <div>
            <p className="font-display text-sm font-semibold leading-none">MG Store</p>
            <p className="text-[11px] text-white/40">Painel administrativo</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-400'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="truncate px-3 text-xs text-white/40">{user?.email}</p>
          <button
            onClick={() => signOut()}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <span>⏻</span> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
