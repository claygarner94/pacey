import { useEffect, useRef, useState, type ElementType } from 'react'

type Props = {
  value: string
  onSave: (next: string) => void
  as?: ElementType
  className?: string
  inputClassName?: string
  ariaLabel?: string
  placeholder?: string
}

export function EditableHeading({
  value,
  onSave,
  as: As = 'h1',
  className = '',
  inputClassName,
  ariaLabel,
  placeholder,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [editing, value])

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== value) onSave(trimmed)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          } else if (e.key === 'Escape') {
            e.preventDefault()
            cancel()
          }
        }}
        placeholder={placeholder}
        className={
          inputClassName ??
          `${className} w-full bg-transparent border-b-2 border-signal/60 focus:outline-none focus:border-signal`
        }
      />
    )
  }

  return (
    <As
      className={`${className} cursor-text border-b border-dashed border-transparent hover:border-ink-subtle/60 transition inline-block`}
      onClick={() => setEditing(true)}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel ?? `Edit ${value}`}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setEditing(true)
        }
      }}
    >
      {value}
    </As>
  )
}
