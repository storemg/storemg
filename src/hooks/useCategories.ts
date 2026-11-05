import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Category } from '../types'

// Cache simples em memória: cabeçalho e rodapé usam a mesma lista de
// categorias, então buscamos uma vez só por visita.
let cache: Category[] | null = null
let inflight: Promise<Category[]> | null = null

async function fetchCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('name')
  return (data ?? []) as Category[]
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(cache ?? [])

  useEffect(() => {
    if (cache) return
    if (!inflight) {
      inflight = fetchCategories().then((list) => {
        cache = list
        return list
      })
    }
    let alive = true
    inflight.then((list) => {
      if (alive) setCategories(list)
    })
    return () => {
      alive = false
    }
  }, [])

  return categories
}
