const ICONS = {
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 flex-shrink-0">
      <rect x="4" y="10.5" width="16" height="10" rx="2" />
      <path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 flex-shrink-0">
      <path d="M2 7h11v9H2z" />
      <path d="M13 10h4l4 3v3h-8z" />
      <circle cx="6.5" cy="18" r="1.6" />
      <circle cx="16.5" cy="18" r="1.6" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 flex-shrink-0">
      <path d="M21 11.5a8.4 8.4 0 0 1-1.2 4.4L21 20l-4.3-1.2a8.5 8.5 0 1 1 4.3-7.3Z" />
    </svg>
  ),
}

const ITEMS = [
  { icon: ICONS.lock, text: 'Compra segura' },
  { icon: ICONS.truck, text: 'Envio rápido' },
  { icon: ICONS.chat, text: 'Atendimento pelo WhatsApp' },
]

export default function TrustBar() {
  // Duplicamos os itens uma vez para o loop ficar contínuo: quando a
  // primeira metade sai pela esquerda, a segunda (idêntica) já está
  // entrando, sem espaço vazio nem salto perceptível.
  const track = [...ITEMS, ...ITEMS]

  return (
    <div
      className="group fixed inset-x-0 top-0 z-40 h-7 overflow-hidden bg-black"
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)',
      }}
    >
      <div className="marquee-track flex h-full w-max items-center gap-12 whitespace-nowrap px-6 text-[11px] font-medium tracking-wide text-white/80 group-hover:[animation-play-state:paused]">
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="flex items-center gap-1.5 text-brand-400">
              {item.icon}
              <span className="text-white/80">{item.text}</span>
            </span>
            <span className="text-brand-400/50">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
