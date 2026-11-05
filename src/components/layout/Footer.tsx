import { Link } from 'react-router-dom'
import { useCategories } from '../../hooks/useCategories'
import { openWhatsApp } from '../../lib/whatsapp'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../../lib/socials'
import { InstagramIcon } from '../Icons'

const PAYMENT_METHODS = ['PIX', 'Visa', 'Mastercard', 'Elo', 'Boleto']

const headingClass = 'font-heading mb-4 text-[15px] font-bold text-white'
const linkClass = 'text-sm text-slate-400 transition hover:text-white'

export default function Footer() {
  const categories = useCategories().slice(0, 6)

  return (
    <footer className="mt-10 bg-[#070b14] text-slate-400">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-block" aria-label="MG Store — página inicial">
            <img
              src="./logo-header.jpg"
              alt="MG Store"
              width={110}
              height={56}
              loading="lazy"
              className="h-14 w-auto rounded-lg"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            MG Store: tudo que você precisa em um só lugar, com produtos de diversas categorias e
            atendimento direto pelo WhatsApp.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-blue-400"
          >
            <InstagramIcon className="h-4 w-4" />
            {INSTAGRAM_HANDLE}
          </a>
        </div>

        <div>
          <h4 className={headingClass}>MG Store</h4>
          <ul className="space-y-3">
            <li><Link to="/catalogo" className={linkClass}>Catálogo</Link></li>
            <li><Link to="/ajuda" className={linkClass}>Central de ajuda</Link></li>
            <li><Link to="/favoritos" className={linkClass}>Favoritos</Link></li>
            <li><Link to="/carrinho" className={linkClass}>Carrinho</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={headingClass}>Categorias</h4>
          <ul className="space-y-3">
            {categories.length === 0 && <li className="text-sm text-slate-600">Em breve</li>}
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/catalogo?categoria=${c.id}`} className={linkClass}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={headingClass}>Atendimento</h4>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => openWhatsApp('Olá! Vim pelo site da MG Store.')}
                className={linkClass}
              >
                Falar no WhatsApp
              </button>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Seguir no Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap py-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Formas de pagamento
            </span>
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded-md border border-white/10 px-2.5 py-1 text-xs font-medium text-slate-300"
              >
                {method}
              </span>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-500">
            MG Store — Loja 100% segura. Usamos criptografia de ponta e seus dados nunca são
            compartilhados. Site confiável e verificado.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            © {new Date().getFullYear()} MG Store — Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
