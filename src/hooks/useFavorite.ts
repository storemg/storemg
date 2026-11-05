import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'mgstore.favorites'

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeFavorites(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // localStorage indisponível — segue sem persistir
  }
  // Avisa outras instâncias do hook na mesma página que a lista mudou
  window.dispatchEvent(new Event('mgstore.favorites.changed'))
}

export function useFavorite(productId: string) {
  const [isFavorite, setIsFavorite] = useState(() => readFavorites().includes(productId))

  useEffect(() => {
    function sync() {
      setIsFavorite(readFavorites().includes(productId))
    }
    window.addEventListener('mgstore.favorites.changed', sync)
    return () => window.removeEventListener('mgstore.favorites.changed', sync)
  }, [productId])

  const toggle = useCallback(() => {
    const current = readFavorites()
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]
    writeFavorites(next)
  }, [productId])

  return { isFavorite, toggle }
}

export function getFavoriteIds(): string[] {
  return readFavorites()
}
