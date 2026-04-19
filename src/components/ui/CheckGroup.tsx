type Option = { value: string; label: string }

type Props = {
  options: Option[]
  value: string[]
  onChange: (next: string[]) => void
  name: string
}

export function CheckGroup({ options, value, onChange, name }: Props) {
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const checked = value.includes(opt.value)
        return (
          <label
            key={opt.value}
            className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition ${
              checked
                ? 'border-ink bg-paper-card'
                : 'border-paper-edge bg-paper-card hover:border-ink-muted'
            }`}
          >
            <input
              type="checkbox"
              name={name}
              checked={checked}
              onChange={() => toggle(opt.value)}
              className="accent-ink"
            />
            <span className="text-sm text-ink">{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}
