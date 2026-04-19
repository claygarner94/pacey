import { Link } from 'react-router-dom'
import { RelayCascade } from './RelayCascade'
import { usePageTitle } from '../../lib/usePageTitle'

export default function Landing() {
  usePageTitle()
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="px-6 py-5">
        <a href="/" className="inline-flex items-center gap-2.5 group">
          <img
            src="/pacey-mascot.png"
            alt=""
            width={60}
            height={60}
            className="size-[60px] group-hover:-rotate-6 transition-transform"
          />
          <span className="font-semibold tracking-tight text-xl">
            PACEY<span className="text-signal">.</span>
          </span>
        </a>
      </nav>

      <section className="flex-1 grid md:grid-cols-2 gap-10 items-center max-w-6xl w-full mx-auto px-6 py-10">
        <div className="space-y-6 md:pr-6">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
            A backup communication plan for you, your household, or your organization.
          </h1>
          <div className="space-y-2">
            <p className="text-lg text-ink-muted">
              If your main way to reach the people you count on fails, PACEY gives you a plan you can share with them so everyone knows what to do.
            </p>
            <p className="text-sm text-ink-subtle">
              Built on <strong className="text-ink font-semibold">PACE</strong> — Primary, Alternate, Contingency, Emergency — the framework emergency managers use worldwide.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              to="/wizard"
              className="inline-flex items-center gap-2 rounded-lg bg-ink text-paper px-5 py-3 font-medium shadow-soft hover:bg-ink-soft transition"
            >
              Build your plan →
            </Link>
            <span className="text-sm text-ink-subtle">Free. No sign-up.</span>
          </div>
        </div>

        <div>
          <RelayCascade />
        </div>
      </section>

      <section id="what-is-pace" className="max-w-3xl w-full mx-auto px-6 pb-16 pt-4">
        <details className="group rounded-xl border border-paper-edge bg-paper-card p-5 open:shadow-soft">
          <summary className="cursor-pointer list-none flex items-center justify-between">
            <span className="font-medium text-ink">What is a PACE plan?</span>
            <span className="text-ink-subtle group-open:rotate-180 transition">▾</span>
          </summary>
          <div className="pt-3 text-ink-muted space-y-3 text-[15px] leading-relaxed">
            <p>
              A PACE plan is a simple way to stay in touch when things don't go as expected.
            </p>
            <p>
              You decide, in advance, how you'll try to reach each other in order:
            </p>
            <ul className="list-disc pl-5 space-y-1 marker:text-ink-subtle">
              <li>
                your <strong className="text-ink">Primary</strong> method (what you use every day)
              </li>
              <li>
                an <strong className="text-ink">Alternate</strong> if that doesn't work
              </li>
              <li>
                a <strong className="text-ink">Contingency</strong> if the first two fail
              </li>
              <li>
                and an <strong className="text-ink">Emergency</strong> option when nothing else is working
              </li>
            </ul>
            <p>
              Instead of improvising in the moment, everyone follows the same fallback path.
            </p>
            <p>
              It comes from military and emergency response, but it's just as useful for families, small teams, and anyone who needs a clear plan when communication breaks down.
            </p>
          </div>
        </details>
      </section>

      <footer className="px-6 py-6 text-xs text-ink-subtle border-t border-paper-edge">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span>An open source project by Clay Garner.</span>
          <Link to="/about" className="hover:text-ink transition">
            About
          </Link>
        </div>
      </footer>
    </main>
  )
}
