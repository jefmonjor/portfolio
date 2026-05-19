import { setRequestLocale } from "next-intl/server"

import { About } from "@/components/portfolio/about"
import { BackgroundGrid } from "@/components/portfolio/background-grid"
import { ConsoleSignature } from "@/components/portfolio/console-signature"
import { Contact } from "@/components/portfolio/contact"
import { Education } from "@/components/portfolio/education"
import { Experience } from "@/components/portfolio/experience"
import { Footer } from "@/components/portfolio/footer"
import { Hero } from "@/components/portfolio/hero"
import { Marquee } from "@/components/portfolio/marquee"
import { Projects } from "@/components/portfolio/projects"
import { Skills } from "@/components/portfolio/skills"
import { TopBar } from "@/components/portfolio/top-bar"
import { profile } from "@/lib/profile"
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="relative min-h-svh bg-background text-foreground">
      <BackgroundGrid />
      <ConsoleSignature />
      <TopBar />
      <main>
        <Hero />
        <Marquee items={profile.marquee} />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
