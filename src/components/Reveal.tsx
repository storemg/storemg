import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`${inView ? 'animate-fade-in-up' : 'opacity-0'} ${className}`}
      style={{ animationDelay: inView ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  )
}
