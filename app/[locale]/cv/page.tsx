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
import { FullSiteBanner } from "@/components/portfolio/full-site-banner"
import { SkipToContent } from "@/components/portfolio/skip-to-content"
import { Hero } from "@/components/portfolio/hero"
import { Projects } from "@/components/portfolio/projects"
import { Reveal } from "@/components/portfolio/reveal"
import { Skills } from "@/components/portfolio/skills"
import { TechIconSprite } from "@/components/portfolio/tech-icon-sprite"
import { TopBar } from "@/components/portfolio/top-bar"
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
        <SkipToContent />
        <ConsoleSignature />
        <FullSiteBanner />
        <TopBar />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <Reveal>
            <About />
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
      {/* Last in the document: 70 KB of glyph paths must not stream ahead of
          the hero. <use> resolves forward references once parsed. */}
      <TechIconSprite />
    </div>
  )
}
