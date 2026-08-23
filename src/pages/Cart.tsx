import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart()
  const money = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 pb-20 pt-32 text-center">
        <p className="text-white/40">Seu carrinho está vazio.</p>
        <Link to="/" className="mt-4 inline-block text-brand-400 hover:underline">
          Ver produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-20 pt-28">
      <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white">Carrinho</h1>

      <div className="mt-6 space-y-3">
        {items.map((i) => (
          <div
            key={i.product.id}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-900 p-4"
          >
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-ink-800">
              {i.product.images?.[0] && (
                <img src={i.product.images[0]} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{i.product.name}</p>
              <p className="text-sm text-white/50">
                {money(i.product.promotional_price ?? i.product.price)}
              </p>
            </div>
            <input
              type="number"
              min={1}
              max={i.product.stock}
              value={i.quantity}
              onChange={(e) => updateQuantity(i.product.id, parseInt(e.target.value) || 1)}
              className="w-16 rounded-lg border border-white/10 bg-ink-800 px-2 py-1 text-sm text-white"
            />
            <button
              onClick={() => removeItem(i.product.id)}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-white/50">Total</span>
        <span className="text-xl font-semibold tracking-[-0.02em] text-white">{money(total)}</span>
      </div>

      <Link
        to="/checkout"
        className="mt-6 block rounded-pill bg-brand-500 py-3 text-center text-sm font-medium text-white transition hover:bg-brand-600"
      >
        Finalizar compra
      </Link>
    </div>
  )
}
