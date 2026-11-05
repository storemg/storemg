// Configuração centralizada dos números de WhatsApp da MG Store.
// Para adicionar mais números no futuro, é só incluir na lista —
// a alternância abaixo já funciona para qualquer quantidade.
export const WHATSAPP_NUMBERS = ['5511913570388']

const STORAGE_KEY = 'mgstore.whatsapp.lastIndex'

// Alterna entre os números (não é sorteio): cada clique usa o próximo
// da lista, e a posição fica salva no navegador para continuar a
// sequência certa mesmo depois de recarregar a página.
function getNextNumber(): string {
  if (WHATSAPP_NUMBERS.length === 1) return WHATSAPP_NUMBERS[0]

  let lastIndex = -1
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) lastIndex = parseInt(stored, 10)
  } catch {
    // localStorage indisponível (modo privado, etc.) — segue sem persistir
  }

  const nextIndex = (lastIndex + 1) % WHATSAPP_NUMBERS.length

  try {
    localStorage.setItem(STORAGE_KEY, String(nextIndex))
  } catch {
    // ignora se não conseguir salvar
  }

  return WHATSAPP_NUMBERS[nextIndex]
}

// Função única usada por TODOS os botões de WhatsApp do site (header,
// hero, footer, botão flutuante, checkout) — garante que a alternância
// seja sempre consistente, não importa de onde o clique partiu.
export function openWhatsApp(message?: string) {
  const number = getNextNumber()
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  window.open(`https://wa.me/${number}${text}`, '_blank')
}
