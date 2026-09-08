import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LifeBuoy, ArrowLeft } from 'lucide-react'
import { ArrowSwap } from '../components/Button.jsx'
import './Subpage.css'

const TOPICS = [
  'Account / access',
  'Deployment',
  'Technical issue',
  'Billing',
  'Partnership',
  'Other',
]

export default function SupportPage() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="subpage">
      <div className="subpage__inner">
        <div className="subpage__grid">
          <div className="subpage__copy">
            <Link className="subpage__back" to="/">
              <ArrowLeft aria-hidden="true" />
              Back to home
            </Link>

            <div className="subpage__icon" aria-hidden="true">
              <LifeBuoy strokeWidth={1.75} />
            </div>

            <h1 className="subpage__title">Support</h1>
            <p className="subpage__lead">
              Questions about the platform, deployment, or your account? Send us a message
              and we&rsquo;ll respond as soon as we can.
            </p>

            <ul className="subpage__list">
              <li>Typical first response within one business day</li>
              <li>
                For scoping and pilots, you can also{' '}
                <Link to="/consultation">book a consultation</Link>.
              </li>
            </ul>
          </div>

          <div className="form-panel">
            <span className="form-panel__badge">
              <LifeBuoy aria-hidden="true" strokeWidth={2} />
              Support
            </span>
            <h2 className="form-panel__title">How can we help?</h2>
            <p className="form-panel__sub">
              Describe your question or issue and we&rsquo;ll route it to the right person.
            </p>

            <form className="form-panel__form" onSubmit={onSubmit}>
              <div className="form-field">
                <label className="form-field__label" htmlFor="support-name">
                  Full name
                </label>
                <input
                  id="support-name"
                  className="form-field__control"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="support-email">
                  Email
                </label>
                <input
                  id="support-email"
                  className="form-field__control"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="support-company">
                  Company (optional)
                </label>
                <input
                  id="support-company"
                  className="form-field__control"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Organisation name"
                />
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="support-topic">
                  Topic
                </label>
                <select
                  id="support-topic"
                  className="form-field__control"
                  name="topic"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  {TOPICS.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="support-subject">
                  Subject
                </label>
                <input
                  id="support-subject"
                  className="form-field__control"
                  name="subject"
                  type="text"
                  placeholder="Short summary of your request"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="support-message">
                  Message
                </label>
                <textarea
                  id="support-message"
                  className="form-field__control"
                  name="message"
                  rows={5}
                  placeholder="Include steps to reproduce, environment (if technical), and what you expected to happen..."
                  required
                />
              </div>

              <button type="submit" className="form-panel__btn">
                <span>Send message</span>
                <span className="form-panel__btn-arrow" aria-hidden="true">
                  <ArrowSwap />
                </span>
              </button>
            </form>

            {sent ? (
              <p className="form-panel__status" role="status">
                Thanks — we received your request and will respond within one business day.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
