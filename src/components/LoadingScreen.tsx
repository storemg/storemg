import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    // Some rápido — só o suficiente para não "piscar" a tela em branco
    // enquanto os primeiros dados (produtos/categorias) chegam.
    const timer = setTimeout(() => setHidden(true), 650)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative pb-3.5 font-display text-[19px] font-semibold tracking-[-0.01em] text-white">
        MG STORE
        <span className="absolute bottom-0 left-0 h-px w-full origin-left animate-loadbar bg-white" />
      </div>
    </div>
  )
}
