const STORAGE_KEY = 'mgstore.favorites'

function read(): string[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    const parsed = value ? JSON.parse(value) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

function write(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    window.dispatchEvent(new CustomEvent('mgstore:favorites-changed'))
  } catch {
    // Mantém o site funcional mesmo se o armazenamento estiver indisponível.
  }
}

export function getFavoriteIds() {
  return read()
}

export function isFavorite(id: string) {
  return read().includes(id)
}

export function toggleFavorite(id: string) {
  const ids = read()
  const next = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
  write(next)
  return next.includes(id)
}
