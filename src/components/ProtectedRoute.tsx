import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Protege TODAS as rotas /admin/*.
// Regras:
//  1. Não logado -> manda para /admin/login (guarda de onde veio, pra
//     voltar depois do login).
//  2. Logado mas não cadastrado em admin_users -> acesso negado.
//     Isso é o que impede um visitante comum que criou conta na loja
//     de simplesmente digitar /admin e entrar.
//  3. Logado e é admin -> libera a rota.
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 text-white/60">
        Carregando…
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-ink-950 px-6 text-center text-white">
        <h1 className="font-display text-2xl font-semibold">Acesso negado</h1>
        <p className="max-w-sm text-white/60">
          Sua conta está autenticada, mas não tem permissão de administrador
          na MG Store.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
