import { describe, expect, it } from "vitest"

import {
  asksForCv,
  cvActions,
  cvReply,
  lastOffer,
} from "@/lib/assistant/cv-intent"

const OFFER = `Buscamos Backend Engineer para nuestro equipo de plataforma.
Requisitos: 5 años de experiencia con Java y Spring Boot.
Experiencia con microservicios y Kubernetes.
Valorable: banca o fintech, inglés B2.
Ofrecemos trabajo remoto y plan de carrera.`

describe("asksForCv", () => {
  it("recognizes a request for the CV in the three locales", () => {
    expect(asksForCv("¿Me pasas tu CV?")).toBe(true)
    expect(asksForCv("Can I get his resume?")).toBe(true)
    expect(asksForCv("Send me the résumé")).toBe(true)
    expect(asksForCv("Vull el currículum en PDF")).toBe(true)
    expect(asksForCv("cv")).toBe(true)
  })

  it("leaves questions and offers to the model", () => {
    expect(asksForCv("¿Qué experiencia tiene en banca?")).toBe(false)
    expect(asksForCv("Resume lo anterior.")).toBe(false)
    expect(asksForCv("Resume su experiencia en banca")).toBe(false)
    expect(asksForCv("")).toBe(false)
    expect(asksForCv(`${OFFER}\n¿Encaja el CV?`.repeat(2))).toBe(false)
  })
})

describe("cvActions", () => {
  it("offers the two ready variants, and the tailored one once an offer exists", () => {
    expect(cvActions(null).map((action) => action.type)).toEqual(["cv", "cv"])
    const withOffer = cvActions(OFFER)
    expect(withOffer.at(-1)).toEqual({ type: "cv-tailor", offer: OFFER })
  })

  it("finds the most recent pasted offer in the conversation", () => {
    expect(
      lastOffer([
        { role: "user", content: OFFER },
        { role: "assistant", content: "Coincidencias…" },
        { role: "user", content: "¿Y el CV para esta oferta?" },
      ])
    ).toBe(OFFER)
    expect(lastOffer([{ role: "user", content: "Hola" }])).toBeNull()
  })

  it("explains the three variants and mentions the pasted offer", () => {
    expect(cvReply("es", false)).toContain("tres versiones")
    expect(cvReply("en", true)).toContain("already have the offer")
    expect(cvReply("ca", false)).toContain("botons")
  })
})
