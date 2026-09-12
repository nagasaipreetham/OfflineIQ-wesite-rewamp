import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import './WhyItMatters.css'

const COPY = [
  'Every query sent to a cloud AI vendor leaves your building. It travels to a server you don\u2019t control, gets processed by a company whose business model runs on that data, and gets billed back to you by the token.',
  'For a legal team drafting a privileged memo, a hospital reviewing a chart, or a bank running a risk model, that\u2019s not a convenience trade-off. That\u2019s the entire compliance function, undone by a chat window.',
]

function Plus({ pos }) {
  return <span className={`matters__plus matters__plus--${pos}`} aria-hidden="true" />
}

function WhyItMatters() {
  return (
    <section className="matters" id="why-it-matters">
      <ShellInner>
        <SectionPin>
          <h2 className="matters__title">
            <span className="matters__num" aria-hidden="true">
              {greekNumeral(1)}.
            </span>
            <span className="matters__label">Why it matters</span>
          </h2>
          <div className="matters__rule" aria-hidden="true" />
        </SectionPin>

        <div className="matters__grid">
          {COPY.map((text) => (
            <p key={text.slice(0, 24)} className="matters__cell matters__cell--copy">
              {text}
            </p>
          ))}
        </div>

        <blockquote className="matters__quote">
          <Plus pos="tl" />
          <Plus pos="tr" />
          <Plus pos="bl" />
          <Plus pos="br" />
          <p>
            We built Fort Knox because &ldquo;trust us&rdquo; isn&rsquo;t an architecture.
            It&rsquo;s a policy. And policies change in a terms-of-service update nobody
            reads.
          </p>
        </blockquote>
      </ShellInner>
    </section>
  )
}

export default WhyItMatters
