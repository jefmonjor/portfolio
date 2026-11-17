import { getTranslations } from "next-intl/server"

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
import { SkipToContent } from "@/components/skip-to-content"
import { Hero } from "@/components/portfolio/hero"
import { Projects } from "@/components/portfolio/projects"
import { Reveal } from "@/components/portfolio/reveal"
import { Skills } from "@/components/portfolio/skills"
import { TechIconSprite } from "@/components/portfolio/tech-icon-sprite"
import { TopBar } from "@/components/portfolio/top-bar"

type CvPageProps = {
  locale: string
  /** Wide screens get the navigation as a fixed rail instead of the top bar. */
  rail?: boolean
}

async function CvPage({ locale, rail = false }: CvPageProps) {
  const tNav = await getTranslations({ locale, namespace: "nav" })

  return (
    <div className="relative isolate min-h-svh bg-background text-foreground">
      <Background />
      <div className={rail ? "relative z-10 wide:pl-64" : "relative z-10"}>
        <SkipToContent label={tNav("skipToContent")} />
        <ConsoleSignature />
        <FullSiteBanner />
        <TopBar rail={rail} />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero rail={rail} />
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
      {/* SVG <use> resolves forward references, so the 70 KB sprite streams last. */}
      <TechIconSprite />
    </div>
  )
}

export { CvPage }
