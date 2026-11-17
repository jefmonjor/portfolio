import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import { ArrowLink } from "@/components/site/arrow-link"
import { titleLabel } from "@/components/site/display-title"
import { EmailActions } from "@/components/site/email-actions"
import { RichText } from "@/components/site/rich-text"
import { TagList } from "@/components/site/tag-list"
import { ToolOrbit } from "@/components/site/tool-orbit"
import type { SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { publicProfiles } from "@/lib/profile"

type PanelProps = {
  locale: SiteLocale
  content: SiteContent
}

function ToolsPanel({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <div className="tile tile-pad">
      <div className="mx-auto w-full max-w-[21rem]">
        <ToolOrbit label={hero.tools.label} center={hero.tools.center} />
      </div>
      <p className="mt-5 text-center text-paragraph-sm text-balance text-text-sub-600">
        {hero.tools.caption}
      </p>
    </div>
  )
}

function MethodPanel({ content }: { content: SiteContent }) {
  const { approach } = content

  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className="tile tile-pad"
    >
      <h2 id="approach-title" className="tile-title">
        {titleLabel(content.display.approach)}
      </h2>
      <p className="mt-2 text-paragraph-md text-text-sub-600">
        {approach.intro}
      </p>
      <ol className="pipeline pipeline-stack mt-5">
        {approach.pipeline.map((stage) => (
          <li
            key={stage.step}
            className={
              stage.human ? "pipeline-stage is-human" : "pipeline-stage"
            }
          >
            <span className="pipeline-step">{stage.step}</span>
            <span className="pipeline-by">{stage.by}</span>
          </li>
        ))}
      </ol>
      <div className="mt-5">
        <TagList
          items={approach.principles.map((principle) => principle.title)}
          label={content.wall.principlesLabel}
        />
      </div>
    </section>
  )
}

function ServicesPanel({ locale, content }: PanelProps) {
  const { services } = content

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="tile tile-pad"
    >
      <h2 id="services-title" className="tile-title">
        {services.homeTitle}
      </h2>
      <p className="mt-2 text-paragraph-md text-text-sub-600">
        {services.statement}
      </p>
      <ul className="mt-5 border-b border-stroke-soft-200">
        {services.items.map((service) => (
          <li
            key={service.id}
            className="flex flex-col gap-1 border-t border-stroke-soft-200 py-4"
          >
            <h3 className="font-heading text-title-h6 text-text-strong-950">
              {service.name}
            </h3>
            <p className="text-paragraph-sm text-text-sub-600">
              {service.summary}
            </p>
            <p className="text-paragraph-sm text-text-strong-950">
              {service.format}
            </p>
          </li>
        ))}
      </ul>
      <ArrowLink
        href={localizedPath(locale, "/services")}
        className="mt-5 self-start"
      >
        {services.details}
      </ArrowLink>
    </section>
  )
}

function AboutPanel({ locale, content }: PanelProps) {
  const { about } = content

  return (
    <section id="about" aria-labelledby="about-title" className="tile tile-pad">
      <h2 id="about-title" className="tile-title">
        {titleLabel(content.display.about)}
      </h2>
      <div className="mt-3 flex flex-col gap-4 text-paragraph-md text-text-strong-950">
        <p className="text-text-sub-600">{about.lead}</p>
        {about.paragraphs.map((paragraph, index) => (
          <p key={index}>
            <RichText locale={locale} content={paragraph} />
          </p>
        ))}
        <p>{about.principle}</p>
      </div>
      <p className="mt-5 border-t border-stroke-soft-200 pt-4 text-paragraph-sm text-text-sub-600">
        {about.facts.map((fact) => fact.value).join(" · ")}
      </p>
    </section>
  )
}

function HiringPanel({
  locale,
  hiring,
}: {
  locale: SiteLocale
  hiring: SiteContent["hiring"]
}) {
  return (
    <section aria-labelledby="hiring-title" className="tile tile-pad">
      <h2 id="hiring-title" className="tile-title">
        {hiring.title}
      </h2>
      <p className="mt-2 text-paragraph-md text-text-sub-600">{hiring.body}</p>
      <ArrowLink
        href={localizedPath(locale, "/cv")}
        prefetch={false}
        className="mt-4 self-start"
      >
        {hiring.cvLink}
      </ArrowLink>
    </section>
  )
}

function ClosingPanel({ locale, content }: PanelProps) {
  const { contact } = content

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="surface-brand tile tile-pad"
    >
      <h2
        id="contact-title"
        className="max-w-[16ch] font-heading text-title-h3 text-text-strong-950"
      >
        {titleLabel(content.display.contact)}
      </h2>
      <p className="mt-3 text-paragraph-md text-text-sub-600">
        {contact.intro}
      </p>
      <Link
        href={localizedPath(locale, "/contact")}
        className="group/arrow site-button mt-6 min-h-14 w-full px-6"
      >
        <ArrowLabel>{contact.brief.title}</ArrowLabel>
      </Link>
      <div className="mt-6 border-t border-stroke-soft-200 pt-5">
        <EmailActions email={contact.email} secondary />
        <p className="mt-3 flex flex-wrap items-center gap-x-5 text-paragraph-sm text-text-sub-600">
          {contact.elsewhere}
          {publicProfiles.map((channel) => (
            <a
              key={channel.href}
              href={channel.href}
              target="_blank"
              rel="me noopener noreferrer"
              className="site-link inline-flex min-h-11 items-center"
            >
              {channel.name}
            </a>
          ))}
        </p>
      </div>
    </section>
  )
}

export {
  AboutPanel,
  ClosingPanel,
  HiringPanel,
  MethodPanel,
  ServicesPanel,
  ToolsPanel,
}
