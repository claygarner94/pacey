export async function downloadAsPdf(node: HTMLElement, filename: string) {
  const { default: html2pdf } = await import('html2pdf.js')
  const options = {
    margin: [0.6, 0.6, 0.6, 0.6] as [number, number, number, number],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
    pagebreak: { mode: ['css', 'legacy'] },
  }
  // @ts-expect-error html2pdf.js types omit pagebreak but runtime supports it
  await html2pdf().from(node).set(options).save()
}

export function safeFilename(displayName: string, date: string) {
  const slug = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'plan'
  return `PACE-plan-${slug}-${date}.pdf`
}
