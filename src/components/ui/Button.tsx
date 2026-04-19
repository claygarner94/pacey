import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-medium transition disabled:opacity-40 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper shadow-soft hover:bg-ink-soft',
  secondary: 'bg-paper-card text-ink border border-paper-edge hover:border-ink-muted',
  ghost: 'text-ink-muted hover:text-ink',
}

export function Button({ variant = 'primary', className = '', ...rest }: Props) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />
}
