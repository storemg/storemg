import { Link } from 'react-router-dom'

export interface Crumb {
  label: string
  to?: string
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Você está em" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {item.to ? (
            <Link to={item.to} className="transition hover:text-blue-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="text-slate-300">/</span>}
        </span>
      ))}
    </nav>
  )
}
