import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import About from './pages/About.jsx'
import Club from './pages/Club.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import PolicyPage from './pages/PolicyPage.jsx'
import Privacy from './pages/Privacy.jsx'
import Product from './pages/Product.jsx'
import Shop from './pages/Shop.jsx'
import usePageMeta from './hooks/usePageMeta.js'
import { faq, returns, shipping } from './content/copy.js'
import { REDIRECTS, SHOP_PATH } from './routes.js'

// Route changes start at the top of the new page, like a full page load. Links with a hash
// (e.g. a product's "Notify me" -> #notify) scroll to that element instead.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  usePageMeta()
  return (
    <>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path={SHOP_PATH} element={<Shop />} />
            <Route path="/products/:slug" element={<Product />} />
            <Route path="/about" element={<About />} />
            <Route path="/club" element={<Club />} />
            <Route path="/faq" element={<PolicyPage copy={faq} />} />
            <Route path="/shipping" element={<PolicyPage copy={shipping} />} />
            <Route path="/returns" element={<PolicyPage copy={returns} />} />
            <Route path="/privacy" element={<Privacy />} />
            {/* The server redirects these too (vercel.json / vite preview); this covers the dev server. */}
            {REDIRECTS.map(({ source, destination }) => (
              <Route key={source} path={source} element={<Navigate to={destination} replace />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      {/* Cookieless Vercel Web Analytics (mentioned on the privacy page). */}
      <Analytics mode={import.meta.env.PROD ? 'production' : 'development'} />
    </>
  )
}
