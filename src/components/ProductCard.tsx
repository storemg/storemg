import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { stockLabel } from '../types'
import { useFavorite } from '../hooks/useFavorite'
import { HeartIcon } from './Icons'

export default function ProductCard({ product }: { product: Product }) {
  const label = stockLabel(product.stock, product.minimum_stock)
  const { isFavorite, toggle } = useFavorite(product.id)
  const money = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const hasPromo = product.promotional_price !== null && product.promotional_price < product.price
  const discount = hasPromo
    ? Math.round((1 - (product.promotional_price as number) / product.price) * 100)
    : 0

  const toneClass =
    label.tone === 'danger'
      ? 'text-red-600'
      : label.tone === 'warning'
        ? 'text-amber-600'
        : 'text-emerald-600'

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Sem imagem</div>
        )}

        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-blue-700 px-1.5 py-0.5 text-[11px] font-bold text-white">
            -{discount}%
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggle()
          }}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow transition hover:text-blue-700"
        >
          <HeartIcon filled={isFavorite} className={`h-4 w-4 ${isFavorite ? 'text-blue-700' : ''}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        {product.brand && (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{product.brand}</p>
        )}
        <h3 className="line-clamp-2 text-[14px] font-medium leading-snug text-slate-900">{product.name}</h3>

        <div className="mt-2">
          {hasPromo && <p className="text-xs text-slate-400 line-through">{money(product.price)}</p>}
          <p className="text-[18px] font-bold leading-tight text-slate-900">
            {money(hasPromo ? (product.promotional_price as number) : product.price)}
          </p>
        </div>

        <p className={`mt-auto pt-2 text-xs font-medium ${toneClass}`}>{label.text}</p>
      </div>
    </Link>
  )
}
