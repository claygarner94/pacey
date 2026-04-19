type Option = { value: string; label: string; hint?: string }

type Props = {
  options: Option[]
  value: string
  onChange: (next: string) => void
  name: string
}

export function RadioGroup({ options, value, onChange, name }: Props) {
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const checked = value === opt.value
        return (
          <label
            key={opt.value}
            className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition ${
              checked
                ? 'border-ink bg-paper-card'
                : 'border-paper-edge bg-paper-card hover:border-ink-muted'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={() => onChange(opt.value)}
              className="mt-0.5 accent-ink"
            />
            <span>
              <span className="block text-sm font-medium text-ink">{opt.label}</span>
              {opt.hint && <span className="block text-xs text-ink-subtle">{opt.hint}</span>}
            </span>
          </label>
        )
      })}
    </div>
  )
}
