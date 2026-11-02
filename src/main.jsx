import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Self-hosted fonts (latin subset, font-display: swap). No requests to Google Fonts.
// Only the hero headline's faces go in the inlined stylesheet; vite.config.js preloads them
// (CRITICAL_FONTS there). The other faces are in fonts-later.css, loaded below after page load.
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import App from './App.jsx'
import './index.css'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Built pages arrive with their markup prerendered (src/entry-server.jsx), so the first paint
// doesn't wait for this script. The dev server and the 404 page send an empty #root instead.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

// Non-hero faces wait for the load event so they don't compete with the hero fonts before LCP.
const loadLaterFonts = () => import('./fonts-later.css')
if (document.readyState === 'complete') loadLaterFonts()
else window.addEventListener('load', loadLaterFonts, { once: true })
