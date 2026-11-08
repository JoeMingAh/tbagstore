import { Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import Privacy from './pages/Privacy.jsx'
import PolicyPage from './pages/PolicyPage.jsx'
import NotFound from './pages/NotFound.jsx'
import usePageMeta from './hooks/usePageMeta.js'
import { faq, returns, shipping } from './content/copy.js'
import { PRODUCT_PATH } from './routes.js'

export default function App() {
  usePageMeta()
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={PRODUCT_PATH} element={<Product />} />
          <Route path="/faq" element={<PolicyPage copy={faq} />} />
          <Route path="/shipping" element={<PolicyPage copy={shipping} />} />
          <Route path="/returns" element={<PolicyPage copy={returns} />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {/* Cookieless Vercel Web Analytics (mentioned on the privacy page). */}
      <Analytics mode={import.meta.env.PROD ? 'production' : 'development'} />
    </div>
  )
}
