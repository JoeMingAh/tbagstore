import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_SITE_URL } from '../routes.js'
import { applyHeadMeta, pageMeta } from '../seo.js'

// The served HTML already has the right tags for the first page (prerendered at build).
// This keeps title, canonical, Open Graph/Twitter and JSON-LD in sync on in-app navigation.
export default function usePageMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    applyHeadMeta(document, pageMeta(pathname, import.meta.env.SITE_URL || DEFAULT_SITE_URL))
  }, [pathname])
}
