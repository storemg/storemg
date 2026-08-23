import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('PIX')
  const [submitting, setSubmitting] = useState(false)

  const money = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const orderItems = items.map((i) => ({
      product_id: i.product.id,
      name: i.product.name,
      price: i.product.promotional_price ?? i.product.price,
      quantity: i.quantity,
    }))

    const { error } = await supabase.from('orders').insert({
      customer_name: name,
      customer_phone: phone,
      items: orderItems,
      total,
      payment_method: paymentMethod,
      status: 'pendente',
    })

    setSubmitting(false)

    if (error) {
      alert('Não foi possível enviar o pedido. Tente novamente.')
      return
    }

    const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER
    if (waNumber) {
      const lines = orderItems
        .map((i) => `${i.quantity}x ${i.name} — ${money(i.price * i.quantity)}`)
        .join('%0A')
      const message = `Olá! Meu pedido na MG Store:%0A${lines}%0A%0ATotal: ${money(total)}%0AForma de pagamento: ${paymentMethod}%0ANome: ${name}`
      window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank')
    }

    clear()
    navigate('/')
  }

  if (items.length === 0) {
    return <div className="mx-auto max-w-md px-6 pb-20 pt-32 text-center text-white/40">Carrinho vazio.</div>
  }

  return (
    <div className="mx-auto max-w-md px-6 pb-20 pt-28">
      <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white">Finalizar compra</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-white/60">Nome completo</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-900 px-3 py-2 text-sm text-white outline-none focus:border-brand-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/60">WhatsApp</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 90000-0000"
            className="w-full rounded-xl border border-white/10 bg-ink-900 px-3 py-2 text-sm text-white outline-none focus:border-brand-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/60">Forma de pagamento</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink-900 px-3 py-2 text-sm text-white outline-none focus:border-brand-500"
          >
            <option>PIX</option>
            <option>Cartão de crédito</option>
            <option>Dinheiro na entrega</option>
          </select>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-white/50">Total</span>
          <span className="text-xl font-semibold tracking-[-0.02em] text-white">{money(total)}</span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-pill bg-brand-500 py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {submitting ? 'Enviando…' : 'Confirmar pedido pelo WhatsApp'}
        </button>
      </form>
    </div>
  )
}
