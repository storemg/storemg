interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Monta a lista de números a mostrar, com "…" quando há muitas páginas —
// sempre mostra a primeira, a última, e uma janela em torno da atual.
function getPageWindow(current: number, total: number): (number | 'gap')[] {
  const pages = new Set<number>()
  pages.add(1)
  pages.add(total)
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= total) pages.add(p)
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const withGaps: (number | 'gap')[] = []
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) withGaps.push('gap')
    withGaps.push(page)
  })
  return withGaps
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageWindow(currentPage, totalPages)

  function go(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange(page)
  }

  return (
    <nav
      aria-label="Navegação de páginas"
      className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
    >
      <button
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
        className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-600 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => go(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition ${
              p === currentPage
                ? 'bg-blue-700 text-white'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => go(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
        className="flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-600 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"
      >
        <span className="hidden sm:inline">Seguinte</span>
        <span aria-hidden>›</span>
      </button>
    </nav>
  )
}
