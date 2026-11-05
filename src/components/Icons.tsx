import type { ReactNode } from 'react'

interface IconProps {
  className?: string
}

function Svg({ className = 'h-5 w-5', children, filled = false }: IconProps & { children: ReactNode; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
)

export const HeartIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Svg {...p} filled={filled}>
    <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.2 1.6 6.6 4.6 5.1c2.3-1.15 4.7-.35 6 1.4 1-1.75 3.4-2.55 5.7-1.4 3 1.5 3.6 5.1 1.9 7.8C18.7 16.65 12 21 12 21Z" />
  </Svg>
)

export const CartIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h3l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.1L21 7H6" />
  </Svg>
)

export const InstagramIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </Svg>
)

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
)

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)

export const ShieldCheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 4.5 6v5.5c0 4.4 3 7.9 7.5 9.5 4.5-1.6 7.5-5.1 7.5-9.5V6L12 3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
)

export const TruckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 7h11v9H2z" />
    <path d="M13 10h4l4 3v3h-8z" />
    <circle cx="6.5" cy="18" r="1.6" />
    <circle cx="16.5" cy="18" r="1.6" />
  </Svg>
)

export const ChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 11.5a8.4 8.4 0 0 1-1.2 4.4L21 20l-4.3-1.2a8.5 8.5 0 1 1 4.3-7.3Z" />
  </Svg>
)

export const HelpCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" />
  </Svg>
)
