import { ChevronRightIcon } from './Icons'

export default function CategoryCard({
  name,
  description,
  image,
  active,
  onClick,
}: {
  name: string
  description?: string | null
  image?: string | null
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex h-full w-full flex-col overflow-hidden rounded-xl border bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        active ? 'border-blue-700 ring-1 ring-blue-700' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {image && (
        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 items-center justify-between gap-2 px-4 py-4">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-slate-900">{name}</h3>
          <p className="mt-0.5 truncate text-[12px] text-slate-500">{description || 'Ver produtos'}</p>
        </div>
        <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-700" />
      </div>
    </button>
  )
}
