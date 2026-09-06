import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import './WhyOffline.css'

const ROWS = [
  ['Works without internet', true, false],
  ['Your data stays in-house', true, false],
  ['No per-token charges', true, false],
  ['No subscription usage caps', true, false],
  ['No API rate limits', true, false],
  ['Unlimited internal usage*', true, false],
  ['Dedicated AI compute', true, false],
  ['Private document processing', true, false],
  ['Custom company knowledge', true, true],
  ['Custom AI agents', true, true],
  ['Runs on your infrastructure', true, false],
  ['Independent of cloud outages', true, false],
  ['Control over your AI environment', true, false],
]

function TickIcon({ tone }) {
  return (
    <svg
      className={`why__tick why__tick--${tone}`}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M7.75 12.15 10.55 14.9 16.35 8.85"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Mark({ ok, tone }) {
  if (!ok) return <span className="why__dash">—</span>
  return <TickIcon tone={tone} />
}

function WhyOffline() {
  return (
    <section className="why" id="why-offlineiq">
      <ShellInner>
        <SectionPin>
          <h2 className="why__title">
            <span className="why__num" aria-hidden="true">
              {greekNumeral(4)}.
            </span>
            <span className="why__label">Why Offline IQ</span>
          </h2>
          <div className="why__rule" aria-hidden="true" />
        </SectionPin>

        <div className="why__intro">
          <h3 className="why__heading">
            Built for Organizations That Need{' '}
            <mark className="why__mark">Control</mark>.
          </h3>
          <p className="why__caption">
            Dedicated AI infrastructure designed for privacy, predictable access, and
            workloads that stay within your environment.
          </p>
        </div>

        <div className="why__table-wrap">
          <table className="why__table">
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">OfflineIQ</th>
                <th scope="col">Cloud AI</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, iq, cloud]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>
                    <Mark ok={iq} tone="on-blue" />
                  </td>
                  <td>
                    <Mark ok={cloud} tone="on-light" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ShellInner>
    </section>
  )
}

export default WhyOffline
