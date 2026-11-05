import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'
import Reveal from '../components/Reveal'
import { useCategories } from '../hooks/useCategories'
import {
  ArrowRightIcon,
  ChatIcon,
  ChevronRightIcon,
  HelpCircleIcon,
  ShieldCheckIcon,
  TruckIcon,
} from '../components/Icons'

const BENEFITS = [
  {
    icon: ShieldCheckIcon,
    title: 'Compra segura',
    text: 'Combine tudo com clareza antes de fechar a compra, direto com a loja.',
  },
  {
    icon: ChatIcon,
    title: 'Atendimento direto',
    text: 'Fale com a MG Store pelo WhatsApp, sem robôs e sem espera.',
  },
  {
    icon: TruckIcon,
    title: 'Entrega',
    text: 'Envio e entrega de acordo com a disponibilidade de cada produto.',
  },
  {
    icon: HelpCircleIcon,
    title: 'Central de ajuda',
    text: 'Respostas para dúvidas sobre compras, pedidos e pagamentos.',
  },
]

// Fundo do banner: degradê azul-marinho. A arte da MG Store (public/hero.jpg)
// entra por cima, no lado direito, com a borda esquerda esmaecida.
const HERO_BACKGROUND = 'linear-gradient(135deg, #0a1124 0%, #0b1530 55%, #0a1a3d 100%)'
const HERO_IMAGE_MASK = 'linear-gradient(to right, transparent 0%, #000 42%)'

function ProductSection({
  title,
  products,
}: {
  title: string
  products: Product[]
}) {
  // Sem produtos, a seção simplesmente não aparece
  if (products.length === 0) return null

  return (
    <section className="wrap pb-10">
      <Reveal>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-[26px] font-bold text-slate-900">{title}</h2>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
          >
            Ver todos <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Reveal>
    </section>
  )
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const categories = useCategories()
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => setProducts((data ?? []) as Product[]))
  }, [])

  const offers = products
    .filter((p) => p.promotional_price !== null && p.promotional_price < p.price)
    .slice(0, 5)
  const featured = products.filter((p) => p.featured).slice(0, 5)
  const latest = products.slice(0, 5)

  return (
    <div>
      {/* BANNER PRINCIPAL */}
      <section className="wrap pt-6">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ backgroundImage: HERO_BACKGROUND }}
        >
          <img
            src="./hero.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-full object-cover object-right opacity-40 sm:w-[66%] sm:opacity-100"
            style={{ maskImage: HERO_IMAGE_MASK, WebkitMaskImage: HERO_IMAGE_MASK }}
          />
          <div className="relative z-10 flex min-h-[340px] max-w-[760px] flex-col justify-center px-6 py-10 sm:min-h-[400px] sm:px-12">
            <span className="w-fit rounded-full border border-white/30 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white/90">
              MG Store · Variedades
            </span>
            <h1 className="mt-6 text-[38px] font-extrabold leading-[1.08] text-white sm:text-[56px]">
              Tudo que você precisa
              <br className="hidden sm:block" /> em um só lugar.
            </h1>
            <p className="mt-5 text-[16px] text-slate-300 sm:text-[18px]">
              Encontre produtos de diversas categorias na MG Store.
            </p>
            <Link
              to="/catalogo"
              className="mt-8 inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Explorar produtos <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      {categories.length > 0 && (
        <section className="wrap py-10">
          <Reveal>
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="text-[26px] font-bold text-slate-900">Categorias</h2>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
              >
                Ver todas <ChevronRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {categories.map((c) => (
                <CategoryCard
                  key={c.id}
                  name={c.name}
                  description={c.description}
                  image={c.image}
                  onClick={() => navigate(`/catalogo?categoria=${c.id}`)}
                />
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* SEÇÕES DE PRODUTOS — só aparecem quando há produtos */}
      <ProductSection title="Ofertas" products={offers} />
      <ProductSection title="Produtos em destaque" products={featured} />
      <ProductSection title="Novidades" products={latest} />

      {/* FACHADA DA MG STORE */}
      <section className="wrap pb-10 pt-2">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
            <img
              src="./brand-store.jpg"
              alt="MG Store — mais que uma loja, é a sua escolha"
              width={778}
              height={288}
              loading="lazy"
              className="min-h-[150px] w-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* POR QUE COMPRAR */}
      <section className="wrap pb-6 pt-4">
        <Reveal>
          <h2 className="mb-5 text-[26px] font-bold text-slate-900">Por que comprar na MG Store</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  )
}
