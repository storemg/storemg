import { Link } from 'react-router-dom'

export interface Crumb {
  label: string
  to?: string
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs text-white/40">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {item.to ? (
            <Link to={item.to} className="transition hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="text-white/80">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="opacity-40">/</span>}
        </span>
      ))}
    </nav>
  )
}
