import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Category, Product } from '../types'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'
import ProductShowcase from '../components/ProductShowcase'
import Reveal from '../components/Reveal'

const FEATURES = [
  {
    title: 'Produtos selecionados',
    text: 'Cada item do catálogo é escolhido pensando em qualidade e custo-benefício.',
  },
  {
    title: 'Atendimento direto',
    text: 'Fale direto com a loja pelo WhatsApp, sem robôs e sem espera.',
  },
  {
    title: 'Compra segura',
    text: 'Combine tudo com clareza antes de fechar — sem letras miúdas.',
  },
  {
    title: 'Sempre atualizando',
    text: 'Catálogo em constante expansão com novidades em tecnologia.',
  },
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<string | null>(searchParams.get('categoria'))
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('active', true).order('name'),
    ]).then(([p, c]) => {
      setProducts((p.data ?? []) as Product[])
      setCategories((c.data ?? []) as Category[])
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    let list = activeCategory ? products.filter((p) => p.category_id === activeCategory) : products
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.brand ?? '').toLowerCase().includes(q)
      )
    }
    return list
  }, [products, activeCategory, search])

  const featured = products.filter((p) => p.featured)
  const brandCount = new Set(products.map((p) => p.brand).filter(Boolean)).size

  return (
    <div>
      {/* HERO — duas colunas: texto + estatísticas | celular flutuando */}
      <section className="border-b border-white/5 bg-ink-950 px-6 pb-20 pt-[130px]">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-4 flex items-center gap-2 text-[13px] font-medium text-white/50">
              <span className="h-px w-6 bg-white/30" />
              MG STORE · TECNOLOGIA
            </p>
            <h1 className="text-[clamp(34px,5vw,56px)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
              Tecnologia que
              <br />
              <span className="text-gradient">acompanha você.</span>
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-white/55">
              Celulares, fones, power banks, carregadores e periféricos selecionados com
              cuidado — com atendimento direto e sem enrolação.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#categorias"
                className="rounded-pill bg-brand-500 px-6 py-3 text-[15px] font-medium text-white transition hover:bg-brand-600"
              >
                Ver catálogo
              </a>
              {import.meta.env.VITE_WHATSAPP_NUMBER && (
                <a
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-pill border border-white/15 px-6 py-3 text-[15px] font-medium text-white transition hover:bg-white/5"
                >
                  Falar com a loja
                </a>
              )}
            </div>

            <div className="mt-12 flex gap-10 border-t border-white/10 pt-8">
              <div>
                <p className="font-display text-2xl font-semibold text-white">{categories.length || '—'}</p>
                <p className="text-xs text-white/40">Categorias de produtos</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-white">{brandCount || '—'}</p>
                <p className="text-xs text-white/40">Marcas disponíveis</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-white">100%</p>
                <p className="text-xs text-white/40">Atendimento direto</p>
              </div>
            </div>
          </div>

          <ProductShowcase />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        {/* CATEGORIAS */}
        <section id="categorias" className="py-24">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-brand-400">Catálogo</p>
                <h2 className="text-[32px] tracking-[-0.03em] text-white">Escolha uma categoria</h2>
                <p className="mt-2 text-white/50">Navegue pelas categorias da MG Store e encontre o que você precisa.</p>
              </div>
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-sm text-brand-400 hover:underline"
                >
                  Limpar filtro
                </button>
              )}
            </div>
          </Reveal>

          {categories.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map((c, i) => (
                <Reveal key={c.id} delay={i * 80}>
                  <CategoryCard
                    name={c.name}
                    description={c.description}
                    active={activeCategory === c.id}
                    onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* DESTAQUES */}
        {featured.length > 0 && (
          <section className="border-t border-white/10 py-24">
            <Reveal>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-brand-400">Ofertas</p>
              <h2 className="mb-8 text-[32px] tracking-[-0.03em] text-white">Destaques da MG Store</h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {featured.slice(0, 4).map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* CATÁLOGO + BUSCA */}
        <section className="border-t border-white/10 py-24">
          <Reveal>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-[26px] tracking-[-0.03em] text-white">
                {activeCategory ? categories.find((c) => c.id === activeCategory)?.name : 'Todos os produtos'}
              </h2>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar produto..."
                className="w-full max-w-xs rounded-pill border border-white/10 bg-ink-900 px-4 py-2 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-brand-500 sm:w-64"
              />
            </div>
          </Reveal>

          {loading && <p className="text-white/40">Carregando produtos…</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-white/40">Nenhum produto encontrado.</p>
          )}

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      {/* POR QUE COMPRAR */}
      <section className="border-t border-white/10 bg-ink-900/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto mb-14 max-w-xl text-center">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-brand-400">Por que a MG Store</p>
            <h2 className="text-[clamp(28px,4vw,44px)] tracking-[-0.03em] text-white">
              Feito para quem quer tecnologia sem complicação
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="h-full rounded-2xl border border-white/10 bg-ink-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-500/30">
                  <div className="mb-4 h-9 w-9 rounded-full bg-brand-500/15" />
                  <h3 className="mb-1.5 text-[15px] font-semibold text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-white/50">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="flex flex-col items-center justify-center border-t border-white/10 bg-ink-950 px-6 py-28 text-center text-white">
        <Reveal className="flex flex-col items-center">
          <p className="mb-3.5 text-[13px] font-semibold text-white/50">Fale com a gente</p>
          <h2 className="mb-8 text-[clamp(30px,5vw,56px)] tracking-[-0.035em]">Entre em contato conosco.</h2>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {import.meta.env.VITE_WHATSAPP_NUMBER && (
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill bg-brand-500 px-6 py-3 text-[16px] text-white transition hover:bg-brand-600"
              >
                Ir para o WhatsApp
              </a>
            )}
            <Link to="/carrinho" className="text-[16px] text-brand-400 hover:underline">
              Ver carrinho ›
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
