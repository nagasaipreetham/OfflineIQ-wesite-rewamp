import { SplitCta } from './Button.jsx'
import './Hero.css'

const CONTACT_HREF = '#contact'

const HERO_BADGES = ['100% Offline', 'Stays On Your Servers', 'Every Answer Cited']

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__field" aria-hidden="true" />

      <div className="hero__inner">
        <p className="hero__badge" style={{ '--i': 0 }}>
          <span className="hero__mark" aria-hidden="true" />
          PRIVATE AI, ON YOUR HARDWARE
        </p>

        <h1 className="hero__title" style={{ '--i': 1 }}>
          Your AI. Inside your walls.{' '}
          <span className="hero__title-line">
            <mark className="hero__highlight">Nothing</mark> leaves.
          </span>
        </h1>

        <p className="hero__caption" style={{ '--i': 2 }}>
          Fort Knox runs a full AI work surface on your own network. No cloud call, no
          token bill, every answer cited back to source.
        </p>

        <ul className="hero__row" style={{ '--i': 3 }}>
          {HERO_BADGES.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>

        <div className="hero__actions" style={{ '--i': 4 }}>
          <a className="btn btn--secondary btn--lg" href={CONTACT_HREF}>
            Contact Us
          </a>
          <SplitCta size="lg" />
        </div>
      </div>
    </section>
  )
}

export default Hero
