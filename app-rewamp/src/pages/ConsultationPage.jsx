import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Lock, Building2, Clock } from 'lucide-react'
import { ArrowSwap } from '../components/Button.jsx'
import './Subpage.css'

const INDUSTRIES = [
  'Healthcare',
  'Legal',
  'Insurance',
  'Government',
  'Finance',
  'Defense',
  'Other',
]

const DEPLOYMENTS = ['AWS VPC', 'On-prem', 'Not sure yet']

const CORPUS_SIZES = [
  'Under 10k documents',
  '10k – 100k documents',
  '100k – 1M documents',
  '1M+ documents',
  'Not sure yet',
]

const STEPS = [
  {
    num: '01',
    title: 'Scoping call (1 hr)',
    body: 'Define corpus, use cases, compliance requirements. Confirm deployment path.',
  },
  {
    num: '02',
    title: 'Pilot deployment (AWS VPC)',
    body: 'Provision inside your AWS account. Ingest corpus subset. Configure RBAC and audit log.',
  },
  {
    num: '03',
    title: 'Pilot period (30–60 days)',
    body: 'Selected users work on real tasks. Usage and output quality reviewed at 30-day mark.',
  },
  {
    num: '04',
    title: 'Evaluation & decision',
    body: 'Review audit log, output quality, and time-saving data. Determine scope for full deployment.',
  },
]

export default function ConsultationPage() {
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

            <p className="subpage__eyebrow">Next steps</p>
            <h1 className="subpage__title">
              Book a scoping call.{' '}
              <span className="subpage__title-mark">One hour.</span>
            </h1>
            <p className="subpage__lead">
              We&rsquo;ll define the document corpus, use cases, and compliance requirements —
              and confirm whether AWS or on-prem is the right deployment path for your
              organisation.
            </p>

            <div className="subpage__chips">
              <span className="subpage__chip">
                <Lock aria-hidden="true" strokeWidth={2} />
                Confidential by default
              </span>
              <span className="subpage__chip">
                <Building2 aria-hidden="true" strokeWidth={2} />
                Enterprise only
              </span>
              <span className="subpage__chip">
                <Clock aria-hidden="true" strokeWidth={2} />
                Reply within 1 business day
              </span>
            </div>

            <p className="subpage__steps-label">What happens next</p>
            <ol className="subpage__steps">
              {STEPS.map((step) => (
                <li key={step.num} className="subpage__step">
                  <span className="subpage__step-num" aria-hidden="true">
                    {step.num}
                  </span>
                  <h2 className="subpage__step-title">{step.title}</h2>
                  <p className="subpage__step-body">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="form-panel">
            <span className="form-panel__badge">Private enquiry</span>
            <h2 className="form-panel__title">Request a consultation</h2>
            <p className="form-panel__sub">
              We&rsquo;ll reply within one business day. No spam, ever.
            </p>

            <form className="form-panel__form" onSubmit={onSubmit}>
              <div className="form-panel__row">
                <div className="form-field">
                  <label className="form-field__label" htmlFor="consult-name">
                    Full name
                  </label>
                  <input
                    id="consult-name"
                    className="form-field__control"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-field__label" htmlFor="consult-email">
                    Work email
                  </label>
                  <input
                    id="consult-email"
                    className="form-field__control"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@firm.com"
                    required
                  />
                </div>
              </div>

              <div className="form-panel__row">
                <div className="form-field">
                  <label className="form-field__label" htmlFor="consult-company">
                    Company
                  </label>
                  <input
                    id="consult-company"
                    className="form-field__control"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Firm or organisation"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-field__label" htmlFor="consult-industry">
                    Industry
                  </label>
                  <select
                    id="consult-industry"
                    className="form-field__control"
                    name="industry"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    {INDUSTRIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-panel__row">
                <div className="form-field">
                  <label className="form-field__label" htmlFor="consult-deploy">
                    Preferred deployment
                  </label>
                  <select
                    id="consult-deploy"
                    className="form-field__control"
                    name="deployment"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    {DEPLOYMENTS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-field__label" htmlFor="consult-corpus">
                    Approx. corpus size
                  </label>
                  <select
                    id="consult-corpus"
                    className="form-field__control"
                    name="corpus"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    {CORPUS_SIZES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="consult-explore">
                  What would you like to explore?
                </label>
                <textarea
                  id="consult-explore"
                  className="form-field__control"
                  name="explore"
                  rows={5}
                  placeholder="Briefly describe your use case and compliance requirements..."
                  required
                />
              </div>

              <button type="submit" className="form-panel__btn">
                <span>Request consultation</span>
                <span className="form-panel__btn-arrow" aria-hidden="true">
                  <ArrowSwap />
                </span>
              </button>
            </form>

            <p className="form-panel__note">
              <Lock aria-hidden="true" strokeWidth={2} />
              Your information stays with OfflineIQ. We never share lead data.
            </p>

            {sent ? (
              <p className="form-panel__status" role="status">
                Thanks — we&rsquo;ll be in touch within one business day.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
