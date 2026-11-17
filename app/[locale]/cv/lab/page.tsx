import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"

import { CvPage } from "@/components/portfolio/cv-page"
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/** A prototype of the CV with the rail, for the owner to compare; it stays out of search. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function LabCvPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <CvPage locale={locale} rail />
}
