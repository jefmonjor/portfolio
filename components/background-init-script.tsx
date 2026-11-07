import {
  BACKGROUND_STORAGE_KEY,
  BACKGROUND_VARIANTS,
  DEFAULT_BACKGROUND,
} from "@/lib/background"

const APPLY_STORED_BACKGROUND_BEFORE_HYDRATION = `(() => {
  try {
    var stored = window.localStorage.getItem(${JSON.stringify(BACKGROUND_STORAGE_KEY)});
    var allowed = ${JSON.stringify(BACKGROUND_VARIANTS)};
    if (stored && allowed.indexOf(stored) !== -1) {
      document.documentElement.dataset.bg = stored;
    } else {
      document.documentElement.dataset.bg = ${JSON.stringify(DEFAULT_BACKGROUND)};
    }
  } catch (e) {
    document.documentElement.dataset.bg = ${JSON.stringify(DEFAULT_BACKGROUND)};
  }
})();`

function BackgroundInitScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: APPLY_STORED_BACKGROUND_BEFORE_HYDRATION,
      }}
    />
  )
}

export { BackgroundInitScript }
