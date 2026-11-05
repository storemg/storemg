const ITEMS = ['SITE SEGURO', 'VARIEDADE DE PRODUTOS', 'ATENDIMENTO', 'OFERTAS', 'MG STORE']

export default function TopMarquee() {
  // Cada metade repete a lista 4x (mais larga que qualquer tela) e a faixa
  // tem duas metades iguais: ao rolar 50% o loop recomeça sem salto nem vão.
  const half = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]
  const track = [...half, ...half]

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden bg-[#05070d]"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%)',
      }}
    >
      <div className="marquee-track flex w-max items-center whitespace-nowrap py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">
        {track.map((text, i) => (
          <span key={i} className="flex items-center">
            <span>{text}</span>
            <span className="mx-7 h-1 w-1 rounded-full bg-blue-600" />
          </span>
        ))}
      </div>
    </div>
  )
}
