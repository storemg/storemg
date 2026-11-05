import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import Breadcrumbs from '../components/Breadcrumbs'
import { getFavoriteIds } from '../hooks/useFavorite'

export default function Favorites() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function load() {
      const ids = getFavoriteIds()
      if (ids.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }
      supabase
        .from('products')
        .select('*')
        .in('id', ids)
        .then(({ data }) => {
          setProducts((data ?? []) as Product[])
          setLoading(false)
        })
    }

    load()
    window.addEventListener('mgstore.favorites.changed', load)
    return () => window.removeEventListener('mgstore.favorites.changed', load)
  }, [])

  return (
    <div className="wrap py-8">
      <Breadcrumbs items={[{ label: 'Início', to: '/' }, { label: 'Favoritos' }]} />

      <h1 className="mt-4 text-[clamp(26px,4vw,36px)] font-bold text-slate-900">Seus favoritos</h1>
      <p className="mt-2 text-slate-500">Produtos que você salvou para ver depois.</p>

      {loading && <p className="mt-8 text-slate-500">Carregando…</p>}

      {!loading && products.length === 0 && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
          <p className="text-slate-800">Você ainda não favoritou nenhum produto.</p>
          <Link to="/catalogo" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline">
            Ver catálogo →
          </Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
