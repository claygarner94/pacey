import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import type { PlanOutput } from '../../lib/schema'
import { downloadAsPdf, safeFilename } from '../../lib/pdf'
import type { PlanView } from './PlanPage'

type Props = {
  plan: PlanOutput
  docRef: React.RefObject<HTMLDivElement | null>
  cardRef: React.RefObject<HTMLDivElement | null>
  view: PlanView
  onRegenerate: () => void
  onMakeCard: () => void
}

export function PlanActions({
  plan,
  docRef,
  cardRef,
  view,
  onRegenerate,
  onMakeCard,
}: Props) {
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(false)

  const activeNode = () => (view === 'card' ? cardRef.current : docRef.current)

  const handlePrint = () => {
    const html = document.documentElement
    const prev = html.getAttribute('data-print-mode')
    html.setAttribute('data-print-mode', view === 'card' ? 'card' : 'document')
    window.print()
    setTimeout(() => {
      if (prev == null) html.removeAttribute('data-print-mode')
      else html.setAttribute('data-print-mode', prev)
    }, 1000)
  }

  const handlePdf = async () => {
    const node = activeNode()
    if (!node) return
    setDownloading(true)
    try {
      await downloadAsPdf(node, safeFilename(plan.displayName, plan.planDate))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      data-print="hide"
      className="sticky top-0 z-10 bg-paper/80 backdrop-blur border-b border-paper-edge"
    >
      <div className="max-w-[780px] mx-auto px-4 py-3 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-ink-muted hover:text-ink transition"
          >
            ← PACEY
          </button>
          <span className="text-ink-subtle">·</span>
          <button
            onClick={() => navigate('/wizard')}
            className="text-sm text-ink-muted hover:text-ink transition"
          >
            Edit answers
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={onRegenerate}>
            Regenerate
          </Button>
          {view === 'document' ? (
            <Button onClick={onMakeCard}>
              Looks good — make my card →
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={handlePrint}>
                Print card
              </Button>
              <Button onClick={handlePdf} disabled={downloading}>
                {downloading ? 'Preparing PDF…' : 'Download PDF'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
