import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    // Some rápido — só o suficiente para não "piscar" a tela em branco
    // enquanto os primeiros dados (produtos/categorias) chegam.
    const timer = setTimeout(() => setHidden(true), 700)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-500 ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <img src="./logo-header.jpg" alt="" width={220} height={112} className="h-28 w-auto" />
      <span className="relative mt-4 block h-px w-40 overflow-hidden">
        <span className="absolute inset-0 origin-left animate-loadbar bg-blue-500" />
      </span>
    </div>
  )
}
