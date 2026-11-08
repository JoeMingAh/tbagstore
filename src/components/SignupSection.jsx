import SignupForm from './SignupForm.jsx'
import { signup as copy } from '../content/copy.js'

export default function SignupSection() {
  return (
    <section id="signup" aria-labelledby="signup-heading" className="scroll-mt-20 border-t border-gold bg-ink text-cream">
      <div className="mx-auto max-w-2xl px-4 py-8 text-center sm:px-6">
        <h2 id="signup-heading" className="text-2xl font-bold sm:text-3xl">
          {copy.heading}
        </h2>
        <p className="mt-3">{copy.body}</p>
        <div className="mx-auto mt-6 max-w-lg rounded-3xl bg-cream p-3 text-left text-ink">
          <SignupForm />
        </div>
      </div>
    </section>
  )
}
