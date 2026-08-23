import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Em produção isso normalmente indica que as variáveis de ambiente
  // não foram configuradas na hospedagem (ex: Vercel/Netlify) ou que
  // o .env local não foi criado a partir do .env.example.
  console.error(
    '[MG Store] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não configuradas. ' +
      'Copie .env.example para .env e preencha com os dados do seu projeto Supabase.'
  )
}

// Sem o genérico <Database>: os tipos de retorno ficam flexíveis (any),
// e cada arquivo já converte o resultado para o tipo certo (Product,
// Category, Order) antes de usar. Isso evita falsos erros de build por
// causa de um schema TypeScript escrito à mão que não bate 100% com o
// schema real do Postgres.
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

export const STORAGE_BUCKET =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'produtos'
