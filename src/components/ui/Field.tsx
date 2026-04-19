import type { ReactNode } from 'react'

type Props = {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
  htmlFor?: string
}

export function Field({ label, hint, required, children, htmlFor }: Props) {
  return (
    <label htmlFor={htmlFor} className="block space-y-1.5">
      <span className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-signal ml-0.5" aria-hidden>*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-ink-subtle">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'w-full rounded-lg border border-paper-edge bg-paper-card px-3 py-2 text-ink placeholder:text-ink-subtle focus:border-signal focus:outline-none'
