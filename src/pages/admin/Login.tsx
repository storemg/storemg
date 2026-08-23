import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { session, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: Location })?.from?.pathname || '/admin'

  if (session) return <Navigate to={from} replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError(error)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-flare-500 font-display text-lg font-bold text-ink-950">
            MG
          </div>
          <h1 className="font-display text-xl font-semibold text-white">
            Painel administrativo
          </h1>
          <p className="mt-1 text-sm text-white/50">Entre com sua conta de administrador</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-ink-900 p-6"
        >
          <label className="mb-1 block text-xs font-medium text-white/60">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-lg border border-white/10 bg-ink-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-500"
            placeholder="voce@mgstore.com.br"
          />

          <label className="mb-1 block text-xs font-medium text-white/60">
            Senha
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-lg border border-white/10 bg-ink-800 px-3 py-2 text-sm text-white outline-none focus:border-brand-500"
            placeholder="••••••••"
          />

          {error && (
            <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-white/30">
          Acesso restrito à equipe da MG Store.
        </p>
      </div>
    </div>
  )
}
