import type { RecommendationItem, RecommendationOutput } from '../../lib/schema'
import { Button } from '../ui/Button'

type Props = {
  status:
    | { kind: 'idle' }
    | { kind: 'loading' }
    | { kind: 'error'; message: string }
    | { kind: 'ready'; data: RecommendationOutput }
  onReview: () => void
  onApply: (item: RecommendationItem) => void
  canApply: (item: RecommendationItem) => boolean
}

export function RecommendationsPanel({ status, onReview, onApply, canApply }: Props) {
  return (
    <section className="max-w-[980px] mx-auto px-4 py-6">
      <div className="rounded-2xl border border-paper-edge bg-paper-card p-6 space-y-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink-subtle font-medium">
            AI Review
          </p>
          <h2 className="text-2xl font-semibold text-ink">
            Optional recommendations, not the source of truth
          </h2>
          <p className="text-ink-muted max-w-3xl">
            Your plan is already built from your own rows. Use AI here only to spot
            weak alternates, missing gaps, or better-fit fallbacks.
          </p>
        </div>

        {status.kind === 'idle' && (
          <div className="space-y-4">
            <p className="text-sm text-ink-muted">
              Run a review when you want a second opinion on independence between tiers,
              contact gaps, or overcomplicated choices.
            </p>
            <Button onClick={onReview}>Run AI review</Button>
          </div>
        )}

        {status.kind === 'loading' && (
          <div className="space-y-3">
            <p className="text-sm text-ink-muted">Reviewing your matrix…</p>
            <div className="h-2 rounded-full bg-paper-edge overflow-hidden">
              <div className="h-full w-1/2 bg-ink animate-pulse" />
            </div>
          </div>
        )}

        {status.kind === 'error' && (
          <div className="space-y-4">
            <p className="text-sm text-ink-muted">{status.message}</p>
            <Button variant="secondary" onClick={onReview}>
              Try review again
            </Button>
          </div>
        )}

        {status.kind === 'ready' && (
          <div className="space-y-5">
            <div className="rounded-xl border border-paper-edge bg-paper px-4 py-3 text-sm text-ink">
              {status.data.summary}
            </div>

            {status.data.items.length === 0 ? (
              <p className="text-sm text-ink-muted">
                No concrete recommendations came back. Your matrix may already be
                reasonably independent and complete.
              </p>
            ) : (
              <div className="grid gap-4">
                {status.data.items.map((item, idx) => {
                  const applyEnabled = canApply(item)
                  return (
                    <article
                      key={`${item.title}-${idx}`}
                      className="rounded-xl border border-paper-edge bg-paper p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
                            <span className={severityClass(item.severity)}>
                              {item.severity}
                            </span>
                            {item.targetAudience && (
                              <span className="text-ink-subtle">
                                {item.targetAudience}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-ink mt-1">
                            {item.title}
                          </h3>
                        </div>
                        {applyEnabled && (
                          <Button
                            variant="secondary"
                            className="!px-3 !py-1.5 !text-sm"
                            onClick={() => onApply(item)}
                          >
                            Apply suggestion
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2 text-sm text-ink-muted">
                        <p>
                          <span className="font-medium text-ink">Issue:</span>{' '}
                          {item.issue}
                        </p>
                        <p>
                          <span className="font-medium text-ink">Suggestion:</span>{' '}
                          {item.recommendation}
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

            <Button variant="ghost" onClick={onReview}>
              Refresh review
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

function severityClass(severity: RecommendationItem['severity']) {
  if (severity === 'high') return 'text-signal font-medium'
  if (severity === 'medium') return 'text-ink font-medium'
  return 'text-ink-subtle font-medium'
}
