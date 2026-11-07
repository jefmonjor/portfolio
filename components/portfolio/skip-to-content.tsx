import { useTranslations } from "next-intl"

function SkipToContent() {
  const t = useTranslations("nav")
  return (
    <a href="#main" className="site-skip-link">
      {t("skipToContent")}
    </a>
  )
}

export { SkipToContent }
