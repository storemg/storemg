import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import Breadcrumbs from '../components/Breadcrumbs'
import Pagination from '../components/Pagination'
import { useCategories } from '../hooks/useCategories'

const PAGE_SIZE = 20

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()
  const categories = useCategories()
  const gridRef = useRef<HTMLDivElement>(null)

  // Categoria e busca ficam na URL — assim os links do menu, da Home e
  // da barra de pesquisa funcionam e a página pode ser compartilhada.
  const activeCategory = searchParams.get('categoria')
  const busca = (searchParams.get('busca') ?? '').trim()

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts((data ?? []) as Product[])
        setLoading(false)
      })
  }, [])

  const categoryNameById = useMemo(() => {
    const map: Record<string, string> = {}
    categories.forEach((c) => {
      map[c.id] = c.name
    })
    return map
  }, [categories])

  const filtered = useMemo(() => {
    let list = products
    if (activeCategory) list = list.filter((p) => p.category_id === activeCategory)
    if (busca) {
      const q = normalize(busca)
      list = list.filter(
        (p) =>
          normalize(p.name).includes(q) ||
          normalize(p.brand ?? '').includes(q) ||
          normalize(categoryNameById[p.category_id ?? ''] ?? '').includes(q)
      )
    }
    return list
  }, [products, activeCategory, busca, categoryNameById])

  // Sempre volta para a página 1 ao trocar de categoria ou de busca
  useEffect(() => {
    setPage(1)
  }, [activeCategory, busca])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function selectCategory(id: string | null) {
    const next = new URLSearchParams(searchParams)
    if (id) next.set('categoria', id)
    else next.delete('categoria')
    setSearchParams(next)
  }

  function handlePageChange(next: number) {
    setPage(next)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const activeName = activeCategory ? categoryNameById[activeCategory] : undefined
  const title = busca ? `Resultados para “${busca}”` : activeName ?? 'Todos os produtos'

  const chipClass = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition ${
      active
        ? 'border-blue-700 bg-blue-700 text-white'
        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
    }`

  return (
    <div className="wrap py-8">
      <Breadcrumbs items={[{ label: 'Início', to: '/' }, { label: 'Catálogo' }]} />

      <h1 className="mt-4 text-[clamp(26px,4vw,36px)] font-bold text-slate-900">
        Catálogo
      </h1>

      {categories.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={() => selectCategory(null)} className={chipClass(!activeCategory)}>
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => selectCategory(activeCategory === c.id ? null : c.id)}
              className={chipClass(activeCategory === c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div ref={gridRef} className="mt-8 scroll-mt-24">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[20px] font-bold text-slate-900">
            {title}
            {!loading && filtered.length > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'})
              </span>
            )}
          </h2>
          {busca && (
            <button
              onClick={() => setSearchParams(activeCategory ? { categoria: activeCategory } : {})}
              className="text-sm text-blue-700 hover:underline"
            >
              Limpar busca
            </button>
          )}
        </div>

        {loading && <p className="text-slate-500">Carregando produtos…</p>}

        {!loading && filtered.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
            {busca ? (
              <>
                <p className="text-slate-800">Nenhum produto encontrado.</p>
                <p className="mt-1 text-sm text-slate-500">
                  Tente pesquisar por outro nome, marca ou categoria.
                </p>
              </>
            ) : (
              <>
                <p className="text-slate-800">Novidades chegando em breve nesta categoria.</p>
                <p className="mt-1 text-sm text-slate-500">
                  Enquanto isso, veja as outras categorias ou fale com a gente no WhatsApp.
                </p>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {pageItems.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}
