import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type RowState = 'idle' | 'trying' | 'failed' | 'success'

type IconProps = { className?: string }
type IconFn = (p: IconProps) => ReactElement

type Channel = { label: string; Icon: IconFn }

type Step = {
  outcome: 'failed' | 'success'
  trying: string
  after: string
}

const CHANNELS: Channel[] = [
  { label: 'Email', Icon: EmailIcon },
  { label: 'Text', Icon: TextIcon },
  { label: 'Call', Icon: PhoneIcon },
  { label: 'Handheld radio', Icon: RadioIcon },
]

const SEQUENCE: Step[] = [
  { outcome: 'failed', trying: 'Trying email…', after: 'No connection. Rolling over.' },
  { outcome: 'failed', trying: 'Trying text…', after: 'No signal. Rolling over.' },
  { outcome: 'failed', trying: 'Calling…', after: "Line's down. One more." },
  { outcome: 'success', trying: 'Radioing…', after: 'Got through.' },
]

const SCENARIO = 'Reaching someone who matters'

const TRYING_MS = 1150
const AFTER_FAIL_MS = 650
const AFTER_SUCCESS_MS = 1400
const LOOP_RESET_HOLD_MS = 2600
const LOOP_RESTART_DELAY_MS = 900
const INITIAL_DELAY_MS = 500

export function RelayCascade() {
  const reduce = useReducedMotion()
  const [states, setStates] = useState<RowState[]>(() =>
    CHANNELS.map(() => 'idle'),
  )
  const [caption, setCaption] = useState('Starting…')
  const [connected, setConnected] = useState(false)
  const timers = useRef<number[]>([])

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  const reset = useCallback(() => {
    setStates(CHANNELS.map(() => 'idle'))
    setCaption('Starting…')
    setConnected(false)
  }, [])

  const runStep = useCallback(
    (i: number) => {
      if (i >= SEQUENCE.length) {
        timers.current.push(
          window.setTimeout(() => {
            reset()
            timers.current.push(
              window.setTimeout(() => runStep(0), LOOP_RESTART_DELAY_MS),
            )
          }, LOOP_RESET_HOLD_MS),
        )
        return
      }

      const step = SEQUENCE[i]

      setStates((prev) => {
        const next = [...prev]
        next[i] = 'trying'
        return next
      })
      setCaption(step.trying)

      timers.current.push(
        window.setTimeout(() => {
          setStates((prev) => {
            const next = [...prev]
            next[i] = step.outcome
            return next
          })
          setCaption(step.after)
          if (step.outcome === 'success') setConnected(true)

          timers.current.push(
            window.setTimeout(
              () => runStep(i + 1),
              step.outcome === 'success' ? AFTER_SUCCESS_MS : AFTER_FAIL_MS,
            ),
          )
        }, TRYING_MS),
      )
    },
    [reset],
  )

  useEffect(() => {
    if (reduce) {
      // Skip animation; render final state.
      setStates(SEQUENCE.map((s) => s.outcome))
      setCaption(SEQUENCE[SEQUENCE.length - 1].after)
      setConnected(true)
      return
    }
    const startTimer = window.setTimeout(() => runStep(0), INITIAL_DELAY_MS)
    timers.current.push(startTimer)
    return clear
  }, [reduce, runStep])

  return (
    <div className="w-full max-w-md mx-auto" aria-hidden>
      <div className="rounded-2xl border border-paper-edge bg-paper-card shadow-soft p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-subtle">
            {SCENARIO}
          </div>
          <StatusPill connected={connected} />
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-3.5">
          {CHANNELS.map((channel, i) => (
            <Row
              key={channel.label}
              channel={channel}
              state={states[i]}
              reduceMotion={!!reduce}
            />
          ))}
        </div>

        {/* Caption */}
        <div
          className={`mt-5 text-[13px] min-h-[18px] transition-colors duration-300 ${
            connected ? 'text-emerald-700' : 'text-ink-subtle'
          }`}
        >
          {caption}
        </div>
      </div>
    </div>
  )
}

function StatusPill({ connected }: { connected: boolean }) {
  return (
    <motion.span
      initial={false}
      animate={{
        backgroundColor: connected ? '#e1f5ee' : '#f3f4f6',
        color: connected ? '#0f6e56' : '#6b7280',
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="text-[12px] px-2.5 py-[3px] rounded-full"
    >
      {connected ? 'connected' : 'trying…'}
    </motion.span>
  )
}

type RowProps = {
  channel: Channel
  state: RowState
  reduceMotion: boolean
}

function Row({ channel, state, reduceMotion }: RowProps) {
  const { Icon, label } = channel
  const isTrying = state === 'trying'
  const isFailed = state === 'failed'
  const isSuccess = state === 'success'

  const iconClass = isSuccess
    ? 'text-emerald-700'
    : isTrying
      ? 'text-ink'
      : isFailed
        ? 'text-red-400/70'
        : 'text-gray-400'

  const labelClass = isSuccess
    ? 'text-ink font-medium'
    : isTrying
      ? 'text-ink'
      : isFailed
        ? 'text-red-400/70 line-through'
        : 'text-ink'

  const trackClass = isSuccess
    ? 'bg-emerald-400 opacity-100'
    : isFailed
      ? 'bg-red-300/70'
      : 'bg-gray-200 opacity-100'

  return (
    <div
      className="grid items-center gap-3 transition-opacity duration-300"
      style={{ gridTemplateColumns: '20px 96px 1fr 20px' }}
    >
      <div
        className={`flex items-center justify-center transition-colors duration-300 ${iconClass}`}
      >
        <Icon className="size-4" />
      </div>
      <div
        className={`text-sm font-medium transition-colors duration-300 ${labelClass}`}
      >
        {label}
      </div>
      <div
        className={`relative h-0.5 rounded-sm overflow-hidden transition-colors duration-300 ${trackClass}`}
      >
        {isTrying && !reduceMotion && (
          <motion.div
            initial={{ left: '-40%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="absolute top-0 h-full w-[40%]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(107, 114, 128, 0.9), transparent)',
              opacity: 0.8,
            }}
          />
        )}
        {isTrying && reduceMotion && (
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(107, 114, 128, 0.4)' }}
          />
        )}
      </div>
      <div className="flex items-center justify-center">
        {isFailed && (
          <span
            className="block size-1 rounded-full bg-gray-400"
            style={{ opacity: 0.5 }}
          />
        )}
        {isSuccess && (
          <motion.div
            initial={reduceMotion ? { scale: 1 } : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="grid place-items-center size-4 rounded-full bg-emerald-600"
          >
            <CheckIcon />
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ---------- Icons (Lucide-style outlines) ----------

function EmailIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  )
}

function TextIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function PhoneIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function RadioIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* antenna */}
      <path d="M15 2 L15 6" />
      {/* body */}
      <rect x="6" y="6" width="12" height="16" rx="1.5" />
      {/* speaker grille */}
      <rect x="8.5" y="8.5" width="7" height="3" rx="0.5" />
      {/* PTT button */}
      <circle cx="12" cy="16" r="1.6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="10"
      height="10"
      fill="none"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
