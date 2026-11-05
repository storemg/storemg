import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart()
  const money = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  if (items.length === 0) {
    return (
      <div className="wrap max-w-2xl py-16 text-center">
        <p className="text-slate-500">Seu carrinho está vazio.</p>
        <Link to="/catalogo" className="mt-4 inline-block font-medium text-blue-700 hover:underline">
          Ver produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="wrap max-w-2xl py-8">
      <h1 className="text-[28px] font-bold text-slate-900">
        Seu carrinho <span className="text-slate-400">({items.length})</span>
      </h1>

      <div className="mt-6 space-y-3">
        {items.map((i) => {
          const unitPrice = i.product.promotional_price ?? i.product.price
          const subtotal = unitPrice * i.quantity
          return (
            <div
              key={i.product.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {i.product.images?.[0] && (
                  <img src={i.product.images[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{i.product.name}</p>
                <p className="text-xs text-slate-500">{money(unitPrice)} cada</p>
                <p className="mt-0.5 text-sm font-semibold text-blue-700">Subtotal: {money(subtotal)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <input
                  type="number"
                  min={1}
                  max={i.product.stock}
                  value={i.quantity}
                  onChange={(e) => updateQuantity(i.product.id, parseInt(e.target.value) || 1)}
                  aria-label="Quantidade"
                  className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900"
                />
                <button
                  onClick={() => removeItem(i.product.id)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Remover
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-slate-500">Total</span>
        <span className="text-xl font-bold text-slate-900">{money(total)}</span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
        <Link
          to="/checkout"
          className="flex-1 rounded-lg bg-blue-700 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Finalizar compra
        </Link>
        <Link
          to="/catalogo"
          className="flex-1 rounded-lg border border-slate-300 bg-white py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Continuar comprando
        </Link>
      </div>
    </div>
  )
}
