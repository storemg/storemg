import { Link } from 'react-router-dom'
import { useCategories } from '../../hooks/useCategories'

export default function CategoryNav() {
  const categories = useCategories()

  return (
    <nav aria-label="Categorias" className="border-b border-slate-200 bg-white">
      <div className="wrap no-scrollbar flex items-center gap-6 overflow-x-auto whitespace-nowrap py-3 text-[14px]">
        <Link to="/catalogo" className="font-semibold text-slate-900 hover:text-blue-700">
          Todas as categorias
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/catalogo?categoria=${c.id}`}
            className="text-slate-600 transition hover:text-blue-700"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}
