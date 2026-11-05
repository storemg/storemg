import Breadcrumbs from '../components/Breadcrumbs'
import { openWhatsApp } from '../lib/whatsapp'

const FAQ = [
  {
    question: 'Como rastrear meu pedido?',
    answer:
      'Assim que seu pedido é enviado, você recebe o código de rastreio pelo WhatsApp. Se ainda não recebeu, é só chamar a gente que confirmamos o status na hora.',
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer:
      'Aceitamos PIX, cartão de crédito (à vista ou parcelado) e boleto. O pagamento é combinado diretamente com a loja no fechamento do pedido.',
  },
  {
    question: 'Qual o prazo de entrega?',
    answer:
      'O prazo varia de acordo com o seu CEP e a disponibilidade do produto. Na página de cada produto você pode calcular uma estimativa, e o prazo exato é confirmado no fechamento da compra.',
  },
]

export default function Help() {
  return (
    <div className="wrap max-w-3xl py-8">
      <Breadcrumbs items={[{ label: 'Início', to: '/' }, { label: 'Ajuda' }]} />

      <div className="mt-4 grid items-center gap-6 md:grid-cols-[1fr_300px]">
        <div>
          <h1 className="text-[clamp(26px,4vw,36px)] font-bold text-slate-900">Central de ajuda</h1>
          <p className="mt-2 text-slate-500">
            Reunimos as dúvidas mais comuns. Se não encontrar o que precisa, fale direto com a gente.
          </p>
        </div>
        <img
          src="./brand-phone.jpg"
          alt="MG Store — tudo que você precisa, em um só lugar"
          width={431}
          height={304}
          loading="lazy"
          className="hidden w-full rounded-xl border border-slate-200 md:block"
        />
      </div>

      <div className="mt-8 space-y-3">
        {FAQ.map((item) => (
          <div key={item.question} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[15px] font-bold text-slate-900">{item.question}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-600">Não encontrou sua resposta?</p>
        <button
          onClick={() => openWhatsApp('Olá! Preciso de ajuda com um pedido/dúvida na MG Store.')}
          className="mt-3 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Falar com atendente
        </button>
      </div>
    </div>
  )
}
