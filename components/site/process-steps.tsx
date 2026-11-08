import type { StartStep } from "@/content/site/types"

type ProcessStepsProps = {
  steps: ReadonlyArray<StartStep>
  deliverableLabel: string
}

/** How an engagement starts, told by what the client holds after each stage. */
function ProcessSteps({ steps, deliverableLabel }: ProcessStepsProps) {
  return (
    <ol className="process-steps">
      {steps.map(({ step, deliverable }) => (
        <li key={step}>
          <p className="text-label-lg text-text-strong-950">{step}</p>
          <p className="stage-deliverable">
            <span className="text-label-sm text-text-strong-950">
              {deliverableLabel}
            </span>
            <span className="text-paragraph-md text-text-sub-600">
              {deliverable}
            </span>
          </p>
        </li>
      ))}
    </ol>
  )
}

export { ProcessSteps }
