export default function WhatsAppFloat() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER
  if (!number) return null

  const message = encodeURIComponent('Olá! Vim pelo site da MG Store.')

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.12c-.24.68-1.4 1.31-1.93 1.36-.5.05-1 .25-3.32-.69-2.8-1.14-4.6-3.97-4.74-4.15-.14-.19-1.14-1.51-1.14-2.88 0-1.37.72-2.04.97-2.32.25-.28.55-.35.73-.35.19 0 .37 0 .53.01.17.01.4-.06.62.48.24.58.81 1.99.88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.28.37-.23.62-.14.26.1 1.63.77 1.9.91.28.14.47.21.53.33.07.12.07.68-.17 1.37Z"/>
      </svg>
    </a>
  )
}
