import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'

// Build-time only (vite.config.js): the markup for one route, written into that route's HTML so
// the page paints before the JS bundle loads. src/main.jsx then hydrates it; the tree must match.
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
