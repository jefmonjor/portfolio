import { describe, expect, it } from "vitest"

import {
  buildBreadcrumbList,
  buildCvStructuredData,
  buildSiteStructuredData,
  personId,
  serializeStructuredData,
} from "@/lib/seo/structured-data"

type GraphNode = Record<string, unknown> & { "@type": string }

function nodeOfType(graph: ReadonlyArray<GraphNode>, type: string): GraphNode {
  const node = graph.find((candidate) => candidate["@type"] === type)
  if (!node) throw new Error(`No ${type} node in the graph`)
  return node
}

const person = {
  positioning: "Software Architect & Senior Backend Engineer",
  currentJobTitle: "Solutions Architect / Technical PM",
  description: "Backend systems for banks and fintechs.",
}

describe("CV structured data", () => {
  const data = buildCvStructuredData({
    ...person,
    locale: "es",
    pageUrl: "https://www.jefmonjor.dev/es/cv",
    title: "CV · Jefferson Montesdeoca",
    publicProjects: [
      {
        id: "corte1d",
        name: "Corte1D",
        description: "Optimización determinista de corte 1D.",
        url: "https://corte1d.jefmonjor.dev",
        keywords: ["Next.js", "PWA"],
      },
    ],
  })
  const graph = data["@graph"] as ReadonlyArray<GraphNode>

  it("links the localized CV page to one stable person identity", () => {
    expect(nodeOfType(graph, "ProfilePage")).toMatchObject({
      url: "https://www.jefmonjor.dev/es/cv",
      inLanguage: "es",
      mainEntity: { "@id": personId },
      hasPart: [{ "@id": "https://www.jefmonjor.dev/#project-corte1d" }],
    })
    expect(nodeOfType(graph, "CreativeWork")).toMatchObject({
      name: "Corte1D",
      creator: { "@id": personId },
    })
  })

  it("claims no alma mater for studies attended without a qualification", () => {
    const personNode = nodeOfType(graph, "Person")

    expect(personNode.alumniOf).toBeUndefined()
    expect(personNode.hasCredential).toMatchObject({
      name: expect.stringContaining("Scrum Master"),
    })
  })

  it("states the occupation for agents that read the graph, not the prose", () => {
    expect(nodeOfType(graph, "Person").hasOccupation).toMatchObject({
      name: person.positioning,
      occupationalCategory: expect.stringContaining("15-1252.00"),
    })
  })
})

describe("site structured data", () => {
  it("publishes the same person on the commercial site and the CV", () => {
    const site = buildSiteStructuredData({ ...person, services: [] })[
      "@graph"
    ] as ReadonlyArray<GraphNode>

    expect(nodeOfType(site, "Person")).toMatchObject({
      "@id": personId,
      name: "Jefferson Montesdeoca Jordán",
      jobTitle: person.currentJobTitle,
      homeLocation: { address: { addressCountry: "AD" } },
      sameAs: expect.arrayContaining(["https://www.linkedin.com/in/jefmonjor"]),
    })
    expect(nodeOfType(site, "WebSite")).toMatchObject({
      url: "https://www.jefmonjor.dev",
    })
  })

  it("lists each service the person offers", () => {
    const site = buildSiteStructuredData({
      ...person,
      services: [
        {
          name: "Build and integrate",
          description: "Custom software taken to production.",
          url: "https://www.jefmonjor.dev/services#delivery",
        },
      ],
    })["@graph"] as ReadonlyArray<GraphNode>

    expect(nodeOfType(site, "Person")).toMatchObject({
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Build and integrate",
            provider: { "@id": personId },
          },
        },
      ],
    })
  })

  it("numbers breadcrumb positions from one, in order", () => {
    expect(
      buildBreadcrumbList([
        { name: "Home", url: "https://www.jefmonjor.dev" },
        { name: "Work", url: "https://www.jefmonjor.dev/work" },
      ]).itemListElement
    ).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.jefmonjor.dev",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Work",
        item: "https://www.jefmonjor.dev/work",
      },
    ])
  })
})

describe("structured data serialization", () => {
  it("cannot close the script element it is embedded in", () => {
    expect(serializeStructuredData({ value: "</script>" })).toBe(
      '{"value":"\\u003c/script>"}'
    )
  })

  it("escapes the line separators that end a JavaScript string", () => {
    expect(serializeStructuredData({ value: "a\u2028b\u2029c" })).toBe(
      '{"value":"a\\u2028b\\u2029c"}'
    )
  })
})
