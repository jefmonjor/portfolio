import { serializeStructuredData } from "@/lib/seo/structured-data"

function StructuredDataScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }}
    />
  )
}

export { StructuredDataScript }
