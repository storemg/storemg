import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { Category } from '../../types'

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories((data ?? []) as Category[])
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    if (editingId) {
      await supabase.from('categories').update({ name, description }).eq('id', editingId)
    } else {
      await supabase.from('categories').insert({ name, description, active: true })
    }

    setName('')
    setDescription('')
    setEditingId(null)
    load()
  }

  function edit(c: Category) {
    setEditingId(c.id)
    setName(c.name)
    setDescription(c.description ?? '')
  }

  async function toggleActive(c: Category) {
    await supabase.from('categories').update({ active: !c.active }).eq('id', c.id)
    load()
  }

  async function remove(c: Category) {
    if (!confirm(`Excluir categoria "${c.name}"?`)) return
    await supabase.from('categories').delete().eq('id', c.id)
    load()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="font-display text-2xl font-semibold">Categorias</h1>
        <p className="mt-1 text-sm text-white/50">{categories.length} categoria(s)</p>

        <div className="mt-6 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-ink-950">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                {c.description && <p className="text-xs text-white/40">{c.description}</p>}
              </div>
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => toggleActive(c)}
                  className={`rounded-full px-2.5 py-1 ${
                    c.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/50'
                  }`}
                >
                  {c.active ? 'Ativa' : 'Inativa'}
                </button>
                <button onClick={() => edit(c)} className="text-brand-400 hover:underline">
                  Editar
                </button>
                <button onClick={() => remove(c)} className="text-red-400 hover:text-red-300">
                  Excluir
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-white/40">
              Nenhuma categoria cadastrada.
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="h-fit rounded-2xl border border-white/10 bg-ink-900 p-5">
        <h2 className="font-display text-sm font-semibold">
          {editingId ? 'Editar categoria' : 'Nova categoria'}
        </h2>
        <label className="mb-1 mt-4 block text-xs font-medium text-white/60">Nome</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: iPhone, Fones, Capinhas…"
          className="w-full rounded-lg border border-white/10 bg-ink-800 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <label className="mb-1 mt-3 block text-xs font-medium text-white/60">Descrição</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-ink-800 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            {editingId ? 'Salvar' : 'Adicionar'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setName('')
                setDescription('')
              }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
