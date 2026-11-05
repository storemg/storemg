import { useState } from 'react'

// Estimativa de frete por CEP. Como o projeto ainda não está integrado a
// nenhuma transportadora/Correios de verdade, aqui é feita uma estimativa
// honesta baseada na região do CEP (primeiro dígito), só para dar uma noção
// de prazo ao cliente. Quando a loja tiver uma conta nos Correios ou em uma
// transportadora, essa função pode ser trocada por uma chamada de API real
// sem mudar o resto da página.
function estimateByCep(cep: string) {
  const digits = cep.replace(/\D/g, '')
  if (digits.length !== 8) return null

  const region = parseInt(digits[0], 10)
  // Regiões dos Correios (0-9) — só uma aproximação de prazo por distância
  const table: Record<number, { min: number; max: number }> = {
    0: { min: 1, max: 3 },
    1: { min: 1, max: 3 },
    2: { min: 2, max: 4 },
    3: { min: 2, max: 4 },
    4: { min: 3, max: 5 },
    5: { min: 3, max: 6 },
    6: { min: 4, max: 7 },
    7: { min: 4, max: 8 },
    8: { min: 5, max: 9 },
    9: { min: 5, max: 10 },
  }
  return table[region] ?? { min: 3, max: 7 }
}

export default function ShippingEstimate() {
  const [cep, setCep] = useState('')
  const [result, setResult] = useState<{ min: number; max: number } | null | 'invalid'>(null)

  function handleCalculate() {
    const estimate = estimateByCep(cep)
    setResult(estimate ?? 'invalid')
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Calcular frete e prazo
      </p>
      <div className="flex gap-2">
        <input
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Digite seu CEP"
          maxLength={9}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-700"
        />
        <button
          onClick={handleCalculate}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
        >
          Calcular
        </button>
      </div>

      {result === 'invalid' && (
        <p className="mt-2 text-xs text-red-600">CEP inválido — digite os 8 números do seu CEP.</p>
      )}
      {result && result !== 'invalid' && (
        <p className="mt-2 text-sm text-emerald-600">
          Entrega estimada em {result.min} a {result.max} dias úteis para esse CEP.
        </p>
      )}
    </div>
  )
}
