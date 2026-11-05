import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Product } from '../types'
import { SearchIcon } from './Icons'

export default function SearchBar({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Fecha o dropdown ao clicar fora dele
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Busca em tempo real, com um pequeno atraso pra não disparar uma
  // consulta a cada tecla digitada.
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    const timeout = setTimeout(async () => {
      const q = query.trim()

      // Categorias cujo nome bate com a busca (ex: "fone" encontra "Fones de Ouvido")
      const { data: matchingCategories } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', `%${q}%`)

      const categoryIds = (matchingCategories ?? []).map((c: { id: string }) => c.id)

      let orFilter = `name.ilike.%${q}%,brand.ilike.%${q}%`
      if (categoryIds.length > 0) {
        orFilter += `,category_id.in.(${categoryIds.join(',')})`
      }

      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .or(orFilter)
        .limit(6)
      setResults((data ?? []) as Product[])
      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  function goToProduct(id: string) {
    setOpen(false)
    setQuery('')
    navigate(`/produto/${id}`)
  }

  // Enter ou clique na lupa: abre o catálogo com todos os resultados da busca
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setOpen(false)
    navigate(`/catalogo?busca=${encodeURIComponent(q)}`)
  }

  const money = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} role="search" className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Buscar produtos na MG Store..."
          aria-label="Buscar produtos"
          className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-4 pr-14 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-md bg-blue-700 text-white transition hover:bg-blue-800"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
      </form>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {loading && <p className="px-4 py-3 text-sm text-slate-500">Buscando…</p>}
          {!loading && results.length === 0 && (
            <div className="px-4 py-4 text-sm">
              <p className="text-slate-800">Nenhum produto encontrado.</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Tente pesquisar por outro nome, marca ou categoria.
              </p>
            </div>
          )}
          {!loading &&
            results.map((p) => (
              <button
                key={p.id}
                onClick={() => goToProduct(p.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-slate-50"
              >
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {p.images?.[0] && (
                    <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500">{money(p.promotional_price ?? p.price)}</p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
