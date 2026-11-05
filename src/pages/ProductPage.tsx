import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Category, Product } from '../types'
import { stockLabel } from '../types'
import { useCart } from '../context/CartContext'
import Breadcrumbs from '../components/Breadcrumbs'
import ShippingEstimate from '../components/ShippingEstimate'
import ProductCard from '../components/ProductCard'
import { openWhatsApp } from '../lib/whatsapp'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [related, setRelated] = useState<Product[]>([])
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
        setActiveImage(0)
        const categoryId = (data as Product | null)?.category_id
        if (categoryId) {
          supabase
            .from('categories')
            .select('*')
            .eq('id', categoryId)
            .single()
            .then(({ data: cat }) => setCategory(cat as Category))

          // Produtos relacionados: outros itens ativos da mesma categoria,
          // sem contar o próprio produto
          supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryId)
            .eq('active', true)
            .neq('id', id)
            .limit(4)
            .then(({ data: rel }) => setRelated((rel ?? []) as Product[]))
        } else {
          setRelated([])
        }
      })
  }, [id])

  if (!product) {
    return (
      <div className="wrap py-10 text-slate-500">Carregando…</div>
    )
  }

  const label = stockLabel(product.stock, product.minimum_stock)
  const money = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const finalPrice = product.promotional_price ?? product.price
  const savings = product.promotional_price ? product.price - product.promotional_price : 0
  const installmentValue = finalPrice / 12

  return (
    <div className="wrap py-8">
      <Breadcrumbs
        items={[
          { label: 'Início', to: '/' },
          { label: 'Catálogo', to: '/catalogo' },
          ...(category ? [{ label: category.name, to: `/catalogo?categoria=${category.id}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-10">
        {/* GALERIA — 1 foto grande + até 4 miniaturas clicáveis */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
            {product.images?.[activeImage] && (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.slice(0, 5).map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-white ${
                    activeImage === i ? 'border-blue-700' : 'border-slate-200'
                  }`}
                >
                  <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-[26px] font-bold leading-tight text-slate-900">
            {product.name}
          </h1>
          {product.brand && <p className="mt-1 text-sm text-slate-500">{product.brand}</p>}

          {/* PREÇO — bem grande, com De/Por, parcelamento e economia no PIX */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            {product.promotional_price ? (
              <>
                <p className="text-sm text-slate-400 line-through">De: {money(product.price)}</p>
                <p className="mt-1 text-[15px] text-slate-500">Por:</p>
                <p className="text-[40px] font-extrabold leading-none text-slate-900">
                  {money(product.promotional_price)}
                </p>
              </>
            ) : (
              <p className="text-[40px] font-extrabold leading-none text-slate-900">
                {money(product.price)}
              </p>
            )}
            <p className="mt-3 text-sm text-slate-600">
              ou 12x de {money(installmentValue)} sem juros
            </p>
            {savings > 0 && (
              <p className="mt-1 text-sm font-medium text-emerald-600">
                Economize {money(savings)} no PIX
              </p>
            )}
          </div>

          <p
            className={`mt-3 text-sm ${
              label.tone === 'danger'
                ? 'text-red-600'
                : label.tone === 'warning'
                  ? 'text-amber-600'
                  : 'text-emerald-600'
            }`}
          >
            {label.text} {label.tone !== 'danger' && `(${product.stock} unidades)`}
          </p>

          {/* BOTÕES DE COMPRA */}
          {product.purchase_link ? (
            // Produto com link de compra próprio (ex: e-book, curso, checkout
            // externo) — o cliente vai direto para essa página, sem passar
            // pelo carrinho ou WhatsApp da loja.
            <div className="mt-6">
              <a
                href={product.purchase_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 py-4 text-[16px] font-semibold text-white transition hover:bg-blue-800"
              >
                ⚡ Comprar agora
              </a>
            </div>
          ) : (
            <>
              <div className="mt-6 flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  disabled={product.stock <= 0}
                  className="w-20 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-700"
                />
              </div>

              <div className="mt-3 space-y-2.5">
                <button
                  onClick={() =>
                    openWhatsApp(`Olá! Quero o ${product.name} que vi no site`)
                  }
                  disabled={product.stock <= 0}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-4 text-[16px] font-semibold text-white transition hover:brightness-95 disabled:opacity-40"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.12c-.24.68-1.4 1.31-1.93 1.36-.5.05-1 .25-3.32-.69-2.8-1.14-4.6-3.97-4.74-4.15-.14-.19-1.14-1.51-1.14-2.88 0-1.37.72-2.04.97-2.32.25-.28.55-.35.73-.35.19 0 .37 0 .53.01.17.01.4-.06.62.48.24.58.81 1.99.88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.28.37-.23.62-.14.26.1 1.63.77 1.9.91.28.14.47.21.53.33.07.12.07.68-.17 1.37Z"/>
                  </svg>
                  {product.stock <= 0 ? 'Produto esgotado' : '⚡ Comprar agora no WhatsApp'}
                </button>

                <button
                  onClick={() => addItem(product, quantity)}
                  disabled={product.stock <= 0}
                  className="w-full rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-40"
                >
                  🛒 Adicionar ao carrinho
                </button>
              </div>
            </>
          )}

          {/* BLOCO DE CONFIANÇA */}
          <div className="mt-6 space-y-2 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
            <p>✅ Loja 100% Segura e Confiável</p>
            <p>🔒 Seus dados são protegidos, com criptografia total</p>
            {!product.purchase_link && <p>🚚 Entrega garantida</p>}
            <p>↩️ 7 dias para troca</p>
          </div>

          {/* FRETE POR CEP — não se aplica a produtos com link de compra próprio */}
          {!product.purchase_link && (
            <div className="mt-4">
              <ShippingEstimate />
            </div>
          )}

          {/* DESCRIÇÃO */}
          {product.description && (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* PRODUTOS RELACIONADOS */}
      {related.length > 0 && (
        <div className="mt-14 border-t border-slate-200 pt-8">
          <h2 className="mb-5 text-[24px] font-bold text-slate-900">
            Você também pode gostar
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
