import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

interface AuthContextValue {
  session: Session | null
  user: User | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verifica se o usuário logado consta na tabela admin_users.
  // Isso é o que separa "está logado" de "pode acessar o painel":
  // um cliente comum pode até criar conta, mas só quem estiver em
  // admin_users passa a proteção de rota (ver ProtectedRoute).
  async function checkIsAdmin(userId: string) {
    const { data } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .maybeSingle()
    return !!data
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        setIsAdmin(await checkIsAdmin(session.user.id))
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        if (session?.user) {
          setIsAdmin(await checkIsAdmin(session.user.id))
        } else {
          setIsAdmin(false)
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'E-mail ou senha incorretos.' }
      }
      return { error: error.message }
    }
    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAdmin,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
