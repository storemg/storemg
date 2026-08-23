import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { stockLabel } from '../types'

export default function ProductCard({ product }: { product: Product }) {
  const label = stockLabel(product.stock, product.minimum_stock)
  const money = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-ink-900 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-brand-500/40 hover:shadow-[0_24px_60px_-20px_rgba(0,113,227,0.35)]"
    >
      <div className="aspect-square overflow-hidden bg-ink-800">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/20">Sem imagem</div>
        )}
      </div>
      <div className="p-5">
        {product.featured && (
          <span className="mb-2 inline-block rounded-pill bg-brand-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-400">
            Destaque
          </span>
        )}
        <h3 className="line-clamp-2 text-[15px] font-medium text-white">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          {product.promotional_price ? (
            <>
              <span className="text-xs text-white/40 line-through">{money(product.price)}</span>
              <span className="font-display font-semibold text-white">
                {money(product.promotional_price)}
              </span>
            </>
          ) : (
            <span className="font-display font-semibold text-white">{money(product.price)}</span>
          )}
        </div>
        <p
          className={`mt-1.5 text-xs transition-opacity ${
            label.tone === 'danger'
              ? 'text-red-400'
              : label.tone === 'warning'
                ? 'text-amber-400'
                : 'text-emerald-400'
          }`}
        >
          {label.text}
        </p>

        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Ver produto →
        </span>
      </div>

      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-brand-500/25 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  )
}
