import { useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ink-950 text-white md:flex">
      {/* Barra superior — visível só no celular/tablet */}
      <div className="flex items-center justify-between border-b border-white/10 bg-ink-900 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-flare-500 font-display text-xs font-bold text-ink-950">
            MG
          </div>
          <p className="font-display text-sm font-semibold">MG Store</p>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70"
        >
          ☰
        </button>
      </div>

      {/* Fundo escuro atrás do menu, só quando aberto no celular */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-ink-900 px-4 py-6 transition-transform duration-200 md:static md:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-flare-500 font-display text-sm font-bold text-ink-950">
              MG
            </div>
            <div>
              <p className="font-display text-sm font-semibold leading-none">MG Store</p>
              <p className="text-[11px] text-white/40">Painel administrativo</p>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            className="text-white/50 md:hidden"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
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

      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <Outlet />
      </main>
    </div>
  )
}
