import type { Locale } from "@/i18n/routing"

// Standard headings that automated screeners recognize — the website's
// editorial titles ("00 — Perfil", "Dónde he trabajado") parse worse.
export const CV_HEADINGS: Record<
  Locale,
  {
    readonly profile: string
    readonly skills: string
    readonly practices: string
    readonly experience: string
    readonly projects: string
    readonly education: string
    readonly languages: string
    readonly evidence: string
    readonly unverified: string
  }
> = {
  es: {
    profile: "Resumen profesional",
    skills: "Habilidades técnicas",
    practices: "Prácticas de ingeniería",
    experience: "Experiencia profesional",
    projects: "Proyectos propios",
    education: "Formación",
    languages: "Idiomas",
    evidence: "Evidencia priorizada",
    unverified: "Requisitos a confirmar",
  },
  ca: {
    profile: "Resum professional",
    skills: "Habilitats tècniques",
    practices: "Pràctiques d'enginyeria",
    experience: "Experiència professional",
    projects: "Projectes propis",
    education: "Formació",
    languages: "Idiomes",
    evidence: "Evidència prioritzada",
    unverified: "Requisits per confirmar",
  },
  en: {
    profile: "Professional Summary",
    skills: "Technical Skills",
    practices: "Engineering Practices",
    experience: "Professional Experience",
    projects: "Personal Projects",
    education: "Education",
    languages: "Languages",
    evidence: "Prioritized evidence",
    unverified: "Requirements to confirm",
  },
} as const
