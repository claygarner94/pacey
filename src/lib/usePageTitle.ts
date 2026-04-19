import { useEffect } from 'react'

const BASE = 'PACEY'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : `${BASE} — a backup plan for you, your household, or your organization`
  }, [title])
}
