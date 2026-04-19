import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const MESSAGES = [
  'Reading your answers…',
  'Mapping your Primary channel…',
  'Stress-testing the Alternate…',
  'Drafting your Contingency and Emergency plays…',
  'Polishing the cover page…',
]

export function Generating() {
  const [msgIdx, setMsgIdx] = useState(0)
  useEffect(() => {
    const id = window.setInterval(
      () => setMsgIdx((i) => Math.min(i + 1, MESSAGES.length - 1)),
      2200,
    )
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="max-w-md text-center space-y-6">
        <motion.img
          src="/pacey-mascot.png"
          alt=""
          width={112}
          height={112}
          animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto size-28"
        />
        <motion.p
          key={msgIdx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-ink"
        >
          {MESSAGES[msgIdx]}
        </motion.p>
        <p className="text-xs text-ink-subtle">
          Usually about 10–20 seconds.
        </p>
      </div>
    </div>
  )
}
