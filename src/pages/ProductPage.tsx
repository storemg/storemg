import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Category, Product } from '../types'
import { stockLabel } from '../types'
import { useCart } from '../context/CartContext'
import Breadcrumbs from '../components/Breadcrumbs'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setProduct(data as Product)
        const categoryId = (data as Product | null)?.category_id
        if (categoryId) {
          supabase
            .from('categories')
            .select('*')
            .eq('id', categoryId)
            .single()
            .then(({ data: cat }) => setCategory(cat as Category))
        }
      })
  }, [id])

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-32 text-white/40">Carregando…</div>
    )
  }

  const label = stockLabel(product.stock, product.minimum_stock)
  const money = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-28">
      <Breadcrumbs
        items={[
          { label: 'Início', to: '/' },
          ...(category ? [{ label: category.name, to: `/?categoria=${category.id}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl border border-white/10 bg-ink-900">
            {product.images?.[activeImage] && (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border-2 ${
                    activeImage === i ? 'border-brand-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white">{product.name}</h1>
          {product.brand && <p className="mt-1 text-sm text-white/50">{product.brand}</p>}

          <div className="mt-4 flex items-baseline gap-3">
            {product.promotional_price ? (
              <>
                <span className="text-white/40 line-through">{money(product.price)}</span>
                <span className="text-2xl font-semibold tracking-[-0.02em] text-white">
                  {money(product.promotional_price)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold tracking-[-0.02em] text-white">
                {money(product.price)}
              </span>
            )}
          </div>

          <p
            className={`mt-2 text-sm ${
              label.tone === 'danger'
                ? 'text-red-400'
                : label.tone === 'warning'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
            }`}
          >
            {label.text} {label.tone !== 'danger' && `(${product.stock} unidades)`}
          </p>

          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-white/60">
            {product.description}
          </p>

          <div className="mt-7 flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={product.stock <= 0}
              className="w-20 rounded-xl border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500"
            />
            <button
              onClick={() => addItem(product, quantity)}
              disabled={product.stock <= 0}
              className="flex-1 rounded-pill bg-brand-500 py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
            >
              {product.stock <= 0 ? 'Esgotado' : 'Adicionar ao carrinho'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
