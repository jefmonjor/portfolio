import { ConnectMap } from "@/components/site/connect-map"
import type { SiteContent } from "@/content/site/types"
import { twoDigits } from "@/lib/numbering"

function ConnectSection({ connect }: { connect: SiteContent["connect"] }) {
  return (
    <section
      id="connect"
      aria-labelledby="connect-title"
      className="connect-scope site-container border-t border-stroke-soft-200 py-16 md:py-24"
    >
      <div className="max-w-[44rem]">
        <h2
          id="connect-title"
          className="font-heading text-title-h2 text-text-strong-950"
        >
          {connect.title}
        </h2>
        <p className="site-prose mt-5 text-text-sub-600">{connect.intro}</p>
      </div>
      <div className="connect-stage mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
        <ol className="connect-steps flex flex-col">
          {connect.steps.map((step, index) => (
            <li key={step.title}>
              <span
                aria-hidden
                className="text-label-sm text-text-soft-400 tabular-nums"
              >
                {twoDigits(index + 1)}
              </span>
              <h3 className="connect-step-title mt-2 font-heading text-title-h4">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[30rem] text-paragraph-lg text-text-sub-600">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
        <div className="connect-visual">
          <div className="site-card bg-bg-weak-50 p-2 sm:p-6">
            <ConnectMap nodes={connect.nodes} />
          </div>
        </div>
      </div>
    </section>
  )
}

export { ConnectSection }
