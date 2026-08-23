import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function Header() {
  const { count } = useCart()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[13px] transition ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`

  return (
    <header className="fixed inset-x-0 top-0 z-30 h-[64px] border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-1.5 font-display text-[15px] font-bold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          MG Store
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass} end>Início</NavLink>
          <NavLink to="/#categorias" className={linkClass}>Catálogo</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {import.meta.env.VITE_WHATSAPP_NUMBER && (
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-pill bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-1.5 text-[13px] font-medium text-white transition hover:opacity-90 sm:inline-block"
            >
              Falar com a loja
            </a>
          )}
          <Link
            to="/carrinho"
            className="relative rounded-pill border border-white/15 px-4 py-1.5 text-[13px] font-medium text-white transition hover:bg-white/10"
          >
            Carrinho
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
