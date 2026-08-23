import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { Category } from '../../types'

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('name')
      .then(({ data }) => setCategories(((data ?? []) as Category[]).slice(0, 5)))
  }, [])

  const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER

  return (
    <footer className="border-t border-white/10 bg-ink-950 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-1.5 font-display text-[15px] font-bold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            MG Store
          </Link>
          <p className="mt-3 max-w-[220px] text-sm text-white/45">
            Celulares, acessórios, periféricos e eletrônicos com curadoria e atendimento direto pelo WhatsApp.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/70">Navegação</h4>
          <ul className="space-y-2 text-sm text-white/45">
            <li><Link to="/" className="hover:text-white">Início</Link></li>
            <li><Link to="/carrinho" className="hover:text-white">Carrinho</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/70">Categorias</h4>
          <ul className="space-y-2 text-sm text-white/45">
            {categories.length === 0 && <li className="text-white/25">Em breve</li>}
            {categories.map((c) => (
              <li key={c.id}>{c.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/70">Contato</h4>
          <ul className="space-y-2 text-sm text-white/45">
            {waNumber && (
              <li>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Falar no WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-white/10 px-6 pt-6 text-xs text-white/35 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} MG Store — Todos os direitos reservados.</span>
        <span>Feito com foco em tecnologia.</span>
      </div>
    </footer>
  )
}
