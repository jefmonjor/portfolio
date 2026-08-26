import { setRequestLocale } from "next-intl/server"

import { About } from "@/components/portfolio/about"
import { AiApproach } from "@/components/portfolio/ai-approach"
import { Assistant } from "@/components/portfolio/assistant"
import { Background } from "@/components/portfolio/background"
import { ConsoleSignature } from "@/components/portfolio/console-signature"
import { Contact } from "@/components/portfolio/contact"
import { Deploy } from "@/components/portfolio/deploy"
import { Education } from "@/components/portfolio/education"
import { Experience } from "@/components/portfolio/experience"
import { Footer } from "@/components/portfolio/footer"
import { Hero } from "@/components/portfolio/hero"
import { Marquee } from "@/components/portfolio/marquee"
import { Metrics } from "@/components/portfolio/metrics"
import { Projects } from "@/components/portfolio/projects"
import { Reveal } from "@/components/portfolio/reveal"
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
    <div className="relative isolate min-h-svh bg-background text-foreground">
      <Background />
      <div className="relative z-10">
        <ConsoleSignature />
        <TopBar />
        <main>
          <Hero />
          <Marquee items={profile.marquee} />
          <Reveal>
            <About />
          </Reveal>
          <Reveal>
            <Metrics />
          </Reveal>
          <Reveal>
            <Experience />
          </Reveal>
          <Reveal>
            <Skills />
          </Reveal>
          <Reveal>
            <AiApproach />
          </Reveal>
          <Reveal>
            <Projects />
          </Reveal>
          <Reveal>
            <Deploy />
          </Reveal>
          <Reveal>
            <Education />
          </Reveal>
          <Reveal>
            <Contact />
          </Reveal>
        </main>
        <Footer />
        <Assistant />
      </div>
    </div>
  )
}
