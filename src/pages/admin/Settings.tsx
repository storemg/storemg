import { useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Settings() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  // Convida um novo administrador. O fluxo seguro é:
  // 1. A pessoa é convidada/cria conta via Supabase Auth (e-mail + senha).
  // 2. Aqui a gente só insere o ID dela na tabela admin_users, o que é
  //    o que realmente concede acesso ao painel (ver ProtectedRoute).
  // Por segurança, essa ação deveria ficar restrita a quem já é admin,
  // o que já é garantido porque esta página está atrás do ProtectedRoute.
  async function handleAddAdmin(e: FormEvent) {
    e.preventDefault()
    setStatus(null)

    const { data: userData, error: userError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (userError) {
      setStatus('Erro ao verificar administrador: ' + userError.message)
      return
    }
    if (userData) {
      setStatus('Esse e-mail já é administrador.')
      return
    }

    setStatus(
      'Para adicionar um novo administrador: peça para a pessoa criar uma conta ' +
        'em /admin/login (ou envie um convite pelo painel do Supabase Auth) e, ' +
        'depois, insira o ID dela na tabela admin_users pelo SQL Editor do Supabase. ' +
        'Veja o passo a passo completo no README.md do projeto.'
    )
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold">Configurações</h1>

      <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900 p-5">
        <h2 className="font-display text-sm font-semibold">Adicionar administrador</h2>
        <p className="mt-1 text-xs text-white/50">
          Verifique se um e-mail já tem acesso ao painel, e veja como conceder acesso a alguém novo.
        </p>
        <form onSubmit={handleAddAdmin} className="mt-4 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@mgstore.com.br"
            className="flex-1 rounded-lg border border-white/10 bg-ink-800 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Verificar
          </button>
        </form>
        {status && <p className="mt-3 text-sm text-white/60">{status}</p>}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900 p-5 text-sm text-white/60">
        <h2 className="mb-2 font-display text-sm font-semibold text-white">Sobre este painel</h2>
        <p>
          Loja: MG Store — celulares, acessórios, periféricos e eletrônicos.
        </p>
        <p className="mt-1">
          WhatsApp de contato configurado em VITE_WHATSAPP_NUMBER (.env).
        </p>
      </div>
    </div>
  )
}
