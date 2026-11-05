import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import SearchBar from '../SearchBar'
import CategoryNav from './CategoryNav'
import { INSTAGRAM_URL } from '../../lib/socials'
import { CartIcon, HeartIcon, InstagramIcon } from '../Icons'

const actionClass =
  'relative flex flex-col items-center gap-0.5 text-[11px] font-medium text-slate-700 transition hover:text-blue-700'

export default function Header() {
  const { count } = useCart()

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="wrap flex flex-wrap items-center gap-x-4 gap-y-3 py-3 md:flex-nowrap md:gap-x-8">
          <Link to="/" className="flex-shrink-0" aria-label="MG Store — página inicial">
            <img
              src="./logo-header.jpg"
              alt="MG Store"
              width={86}
              height={44}
              className="h-11 w-auto rounded-lg"
            />
          </Link>

          {/* Pesquisa: linha própria no celular, no meio no computador */}
          <div className="order-3 w-full md:order-none md:max-w-[680px] md:flex-1">
            <SearchBar />
          </div>

          <div className="ml-auto flex flex-shrink-0 items-center gap-5">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Siga a MG Store no Instagram"
              className={actionClass}
            >
              <InstagramIcon className="h-6 w-6" />
              Instagram
            </a>
            <Link to="/favoritos" aria-label="Meus favoritos" className={actionClass}>
              <HeartIcon className="h-6 w-6" />
              Favoritos
            </Link>
            <Link to="/carrinho" aria-label="Meu carrinho" className={actionClass}>
              <CartIcon className="h-6 w-6" />
              Carrinho
              {count > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-700 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
      <CategoryNav />
    </>
  )
}
