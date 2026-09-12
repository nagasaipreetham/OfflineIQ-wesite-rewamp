import { Link } from 'react-router-dom'
import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import { ArrowRight } from './Button.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import './MeetFortKnox.css'

export const FORT_KNOX_TIERS = [
  {
    id: 'core',
    num: '1',
    eyebrow: 'Ideal for small business',
    name: 'Fort Knox Core',
    points: ['Built for teams of 5 to 6', 'Working concurrently, scales to 15 seats'],
    cta: 'Secure your data with Fort Knox',
  },
  {
    id: 'enterprise',
    num: '2',
    eyebrow: 'Ideal for enterprises',
    name: 'Fort Knox Enterprise',
    points: [
      'Scales further as adoption grows across departments',
      'Multi-node deployment for the largest teams',
    ],
    cta: 'Book a 30-min scoping call',
  },
]

const CONSULT_HREF = '/consultation'

function MeetFortKnox() {
  return (
    <section className="meet" id="meet-fort-knox">
      <ShellInner>
        <SectionPin>
          <h2 className="meet__title">
            <span className="meet__pin-num" aria-hidden="true">
              {greekNumeral(4)}.
            </span>
            <span className="meet__label">Meet Fort Knox</span>
          </h2>
          <div className="meet__rule" aria-hidden="true" />
        </SectionPin>

        <div className="meet__intro">
          <h3 className="meet__heading">
            A sealed unit. Plugged into your network, not the internet.
          </h3>
        </div>

        <div className="meet__split">
          <div className="meet__visual">
            <span className="meet__tick meet__tick--tl" aria-hidden="true" />
            <span className="meet__tick meet__tick--tr" aria-hidden="true" />
            <span className="meet__tick meet__tick--bl" aria-hidden="true" />
            <span className="meet__tick meet__tick--br" aria-hidden="true" />
            <img
              className="meet__image"
              src="/fort-knox.png"
              alt="Fort Knox hardware"
            />
          </div>

          <div className="meet__copy">
            <h4 className="meet__subhead">Plug It In. Start Working.</h4>
            <p className="meet__body">
              Fort Knox arrives pre-configured. Connect it to your internal network and
              access OfflineIQ through a browser on any device within your environment.
            </p>
          </div>
        </div>

        <div className="meet__tiers">
          {FORT_KNOX_TIERS.map((tier) => (
            <article
              key={tier.id}
              className={`meet__tier meet__tier--${tier.id}`}
            >
              <p className="meet__eyebrow">
                <span className="meet__eyebrow-num" aria-hidden="true">
                  {tier.num}
                </span>
                {tier.eyebrow}
              </p>
              <h4 className="meet__tier-name">{tier.name}</h4>
              <ul className="meet__tier-points">
                {tier.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Link className="meet__cta" to={CONSULT_HREF}>
                {tier.cta}
                <ArrowRight />
              </Link>
            </article>
          ))}
        </div>
      </ShellInner>
    </section>
  )
}

export default MeetFortKnox
