import { twoDigits } from "@/lib/numbering"

function ProcessSteps({ steps }: { steps: ReadonlyArray<string> }) {
  return (
    <ol className="process-steps">
      {steps.map((step, index) => (
        <li key={step}>
          <span aria-hidden className="process-marker">
            {twoDigits(index + 1)}
          </span>
          <p className="text-paragraph-md text-text-strong-950">{step}</p>
        </li>
      ))}
    </ol>
  )
}

export { ProcessSteps }
