import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../content/copy.js'

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} tbagstore</p>
        <div className="flex flex-wrap gap-4">
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand">
            {CONTACT_EMAIL}
          </a>
          <Link to="/privacy" className="hover:text-brand">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
