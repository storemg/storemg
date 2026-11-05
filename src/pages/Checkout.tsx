import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import { openWhatsApp } from '../lib/whatsapp'

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

    const lines = orderItems
      .map((i) => `${i.quantity}x ${i.name} — ${money(i.price * i.quantity)}`)
      .join('\n')
    const message = `Olá! Meu pedido na MG Store:\n${lines}\n\nTotal: ${money(total)}\nForma de pagamento: ${paymentMethod}\nNome: ${name}`
    openWhatsApp(message)

    clear()
    navigate('/')
  }

  if (items.length === 0) {
    return <div className="wrap max-w-md py-16 text-center text-slate-500">Carrinho vazio.</div>
  }

  return (
    <div className="wrap max-w-md py-8">
      <h1 className="text-[28px] font-bold text-slate-900">Finalizar compra</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Nome completo</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">WhatsApp</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 90000-0000"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Forma de pagamento</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-700"
          >
            <option>PIX</option>
            <option>Cartão de crédito</option>
            <option>Dinheiro na entrega</option>
          </select>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="text-slate-500">Total</span>
          <span className="text-xl font-bold text-slate-900">{money(total)}</span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
        >
          {submitting ? 'Enviando…' : 'Confirmar pedido pelo WhatsApp'}
        </button>
      </form>
    </div>
  )
}
