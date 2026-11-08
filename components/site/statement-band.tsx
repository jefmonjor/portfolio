import Image from "next/image"

import { DisplayTitle } from "@/components/site/display-title"
import { sitePhotos } from "@/content/site/photos"
import type { SiteContent } from "@/content/site/types"

function StatementBand({ display }: { display: SiteContent["display"] }) {
  return (
    <section aria-label={display.statementDetail} className="px-3 md:px-6">
      <div className="statement-frame surface-dark">
        <Image
          src={sitePhotos.statement.image}
          alt=""
          placeholder="blur"
          sizes="100vw"
          className="statement-photo"
        />
        <div aria-hidden className="statement-shade" />
        <div className="statement-copy">
          <p className="max-w-[20ch] font-heading text-title-h2 text-text-strong-950">
            <DisplayTitle title={display.statement} />
          </p>
          <p className="mt-6 max-w-[34rem] text-paragraph-lg text-text-strong-950">
            {display.statementDetail}
          </p>
        </div>
      </div>
    </section>
  )
}

export { StatementBand }
