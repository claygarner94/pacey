type Props = {
  current: number
  completed: number
  total: number
}

export function Progress({ current, completed, total }: Props) {
  const pct = Math.round((completed / total) * 100)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-ink-subtle">
        <span>
          Step {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        className="h-1.5 rounded-full bg-paper-edge overflow-hidden"
      >
        <div
          className="h-full bg-ink transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
