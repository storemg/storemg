const EMOJI: Record<string, string> = {
  celulares: '📱',
  fones: '🎧',
  'fones de ouvido': '🎧',
  powerbanks: '🔋',
  'power banks': '🔋',
  carregadores: '🔌',
  perifericos: '🖱️',
  periféricos: '🖱️',
}

function iconFor(name: string) {
  const key = name.trim().toLowerCase()
  return EMOJI[key] ?? '⚡'
}

export default function CategoryCard({
  name,
  description,
  active,
  onClick,
}: {
  name: string
  description?: string | null
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 ease-out hover:-translate-y-1.5 ${
        active
          ? 'border-brand-500/60 bg-brand-500/10'
          : 'border-white/10 bg-ink-900 hover:border-brand-500/40'
      }`}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-xl transition-transform duration-300 group-hover:scale-110">
        {iconFor(name)}
      </div>
      <h3 className="text-[15px] font-semibold text-white">{name}</h3>
      {description && <p className="mt-1 text-xs text-white/50">{description}</p>}
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Ver produtos →
      </span>
      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-brand-500/30 transition-opacity duration-300 group-hover:opacity-100" />
    </button>
  )
}
