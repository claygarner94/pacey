import { Link } from 'react-router-dom'
import { usePageTitle } from '../../lib/usePageTitle'

export default function About() {
  usePageTitle('About')
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="max-w-3xl mx-auto w-full px-6 py-6">
        <Link
          to="/"
          aria-label="Back to home"
          className="inline-flex items-center gap-2 group"
        >
          <img
            src="/pacey-mascot.png"
            alt=""
            width={48}
            height={48}
            className="size-12 group-hover:-rotate-6 transition-transform"
          />
          <span className="font-semibold tracking-tight text-lg">
            PACEY<span className="text-signal">.</span>
          </span>
        </Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-8 space-y-10 text-ink">
        <header className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink-subtle font-medium">
            About
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            PACEY is a free, open source tool for generating PACE communication plans.
          </h1>
          <p className="text-lg text-ink-muted">
            Answer a short set of questions, build a real PACE matrix across Primary, Alternate, Contingency, and Emergency, then print it as a worksheet or wallet card. AI can review the result, but it does not author the plan for you.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Who built this?</h2>
          <p className="text-ink-muted">
            Clay Garner, an emergency management and tech professional. PACEY is MIT-licensed and open to contributions, forks, and issues.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">What does it collect?</h2>
          <p className="text-ink-muted">
            No accounts, no analytics, no server-side logs.
          </p>
          <p className="text-ink-muted">
            Your plan is built locally from the rows you enter. If you choose to run the optional AI review, the matrix and review context are sent once to an LLM provider's API for recommendations. Nothing is intentionally persisted server-side. When you close the tab, the plan exists only where you chose to save it — a printed card, a downloaded PDF, or nowhere.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">What is PACE?</h2>
          <p className="text-ink-muted">
            PACE is a layered communications framework widely used in emergency management and continuity planning. Each tier is a fallback for the one above it: Primary is the channel you use by default, Alternate is what you switch to when Primary fails, Contingency when both are unavailable, and Emergency when nothing else works. The framework is designed to be{' '}
            <em>all-hazards</em>
            {' '}— a single ladder that holds up whether the cause is a storm, a network outage, a lost phone, or an evacuation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Is it free?</h2>
          <p className="text-ink-muted">
            Yes. No sign-up, no paywall. Issues and PRs welcome.
          </p>
        </section>

        <section className="pt-4">
          <Link
            to="/wizard"
            className="inline-flex items-center gap-2 rounded-lg bg-ink text-paper px-5 py-3 font-medium shadow-soft hover:bg-ink-soft transition"
          >
            Build your plan →
          </Link>
        </section>
      </article>

      <footer className="mt-auto px-6 py-6 text-xs text-ink-subtle border-t border-paper-edge">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span>PACEY</span>
          <a
            href="https://www.linkedin.com/in/garnerclay/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink transition"
          >
            An open source project by Clay Garner.
          </a>
        </div>
      </footer>
    </main>
  )
}
