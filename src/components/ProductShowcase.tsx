const ICONS: Record<string, JSX.Element> = {
  headphones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="2.5" y="13" width="4" height="6" rx="1.5" />
      <rect x="17.5" y="13" width="4" height="6" rx="1.5" />
    </svg>
  ),
  battery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <path d="M22 10v4" />
    </svg>
  ),
  plug: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M9 2v4M15 2v4M7 10h10v3a5 5 0 0 1-10 0v-3ZM12 18v4" />
    </svg>
  ),
  mouse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="6" y="3" width="12" height="18" rx="6" />
      <path d="M12 3v6" />
    </svg>
  ),
}

const CORNERS: { icon: keyof typeof ICONS; className: string; delay: string }[] = [
  { icon: 'headphones', className: 'left-0 top-4 sm:-left-4', delay: '0s' },
  { icon: 'plug', className: 'right-0 top-4 sm:-right-4', delay: '.6s' },
  { icon: 'battery', className: 'left-0 bottom-16 sm:-left-6', delay: '1.2s' },
  { icon: 'mouse', className: 'right-0 bottom-16 sm:-right-6', delay: '1.8s' },
]

export default function ProductShowcase() {
  return (
    <div className="relative mx-auto flex w-full max-w-xs items-center justify-center py-6">
      {CORNERS.map((c) => (
        <div
          key={c.icon}
          className={`absolute z-10 flex h-14 w-14 animate-float-sm items-center justify-center rounded-2xl border border-white/10 bg-ink-900/90 shadow-lg shadow-black/30 backdrop-blur ${c.className}`}
          style={{ animationDelay: c.delay }}
        >
          <span className="h-5 w-5 text-brand-400">{ICONS[c.icon]}</span>
        </div>
      ))}

      {/* Mockup de celular com fundo gradiente, flutuando */}
      <div className="relative h-[300px] w-[160px] animate-float rounded-[32px] border border-white/10 bg-ink-900 p-2 shadow-[0_50px_100px_-30px_rgba(0,113,227,0.35)] sm:h-[360px] sm:w-[190px]">
        <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-gradient-to-b from-brand-500/70 via-brand-600/60 to-emerald-500/60">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-10 w-10 text-white/90">
              <rect x="7" y="2" width="10" height="20" rx="2.4" />
            </svg>
          </div>
        </div>
        <div className="absolute left-1/2 top-1.5 h-3 w-14 -translate-x-1/2 rounded-full bg-ink-950" />
      </div>
    </div>
  )
}
