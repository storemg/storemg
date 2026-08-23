import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, STORAGE_BUCKET } from '../../lib/supabaseClient'
import type { Category, Product } from '../../types'

const empty = {
  name: '',
  description: '',
  price: 0,
  promotional_price: null as number | null,
  stock: 0,
  minimum_stock: 3,
  category_id: null as string | null,
  brand: '',
  images: [] as string[],
  featured: false,
  active: true,
}

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = id && id !== 'novo'
  const navigate = useNavigate()

  const [form, setForm] = useState(empty)
  const [categories, setCategories] = useState<Category[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }) => setCategories((data ?? []) as Category[]))

    if (isEdit) {
      supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          if (data) setForm(data as unknown as typeof empty)
        })
    }
  }, [id, isEdit])

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    const uploaded: string[] = []

    for (const file of Array.from(files)) {
      const path = `${crypto.randomUUID()}-${file.name}`
      const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    }

    setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }))
    setUploading(false)
  }

  function removeImage(url: string) {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }))
  }

  function moveImage(index: number, dir: -1 | 1) {
    setForm((f) => {
      const imgs = [...f.images]
      const target = index + dir
      if (target < 0 || target >= imgs.length) return f
      ;[imgs[index], imgs[target]] = [imgs[target], imgs[index]]
      return { ...f, images: imgs }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    if (isEdit) {
      await supabase.from('products').update(form).eq('id', id)
    } else {
      await supabase.from('products').insert(form)
    }

    setSaving(false)
    navigate('/admin/produtos')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold">
        {isEdit ? 'Editar produto' : 'Novo produto'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-white/60">Nome</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-white/60">Descrição</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/60">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
              className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/60">
              Preço promocional (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.promotional_price ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  promotional_price: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/60">Estoque</label>
            <input
              type="number"
              required
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/60">
              Estoque mínimo (alerta)
            </label>
            <input
              type="number"
              value={form.minimum_stock}
              onChange={(e) => setForm({ ...form, minimum_stock: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/60">Categoria</label>
            <select
              value={form.category_id ?? ''}
              onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}
              className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm outline-none focus:border-brand-500"
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/60">Marca</label>
            <input
              value={form.brand ?? ''}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Produto em destaque
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Ativo na loja
          </label>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-white/60">Imagens</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files)}
            className="text-sm text-white/60"
          />
          {uploading && <p className="mt-1 text-xs text-white/40">Enviando…</p>}

          {form.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {form.images.map((url, i) => (
                <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/10">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/60 py-0.5">
                    <button type="button" onClick={() => moveImage(i, -1)} className="text-[10px] text-white/80">
                      ←
                    </button>
                    <button type="button" onClick={() => removeImage(url)} className="text-[10px] text-red-400">
                      ✕
                    </button>
                    <button type="button" onClick={() => moveImage(i, 1)} className="text-[10px] text-white/80">
                      →
                    </button>
                  </div>
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-flare-500 px-1 text-[9px] font-bold text-ink-950">
                      capa
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Salvar produto'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/produtos')}
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-white/70 hover:bg-white/5"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
