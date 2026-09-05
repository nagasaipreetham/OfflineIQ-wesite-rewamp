import { SplitCta } from './Button.jsx'
import './Hero.css'

const CONTACT_HREF = '#contact'

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__field" aria-hidden="true" />

      <div className="hero__inner">
        <p className="hero__badge" style={{ '--i': 0 }}>
          <span className="hero__mark" aria-hidden="true" />
          Pre-launch access is now open.
        </p>

        <h1 className="hero__title" style={{ '--i': 1 }}>
          Stop Renting Intelligence.{' '}
          <span className="hero__title-line">
            Start <mark className="hero__highlight">Owning</mark> It.
          </span>
        </h1>

        <p className="hero__caption" style={{ '--i': 2 }}>
          Your Company, Powered by Its Own AI.
        </p>

        <p className="hero__desc" style={{ '--i': 3 }}>
          Run personalized AI model and agents inside your organization, where sensitive
          information stays protected and AI works directly with the knowledge that
          matters most
        </p>

        <div className="hero__actions" style={{ '--i': 4 }}>
          <a className="btn btn--secondary btn--lg" href={CONTACT_HREF}>
            Contact Us
          </a>
          <SplitCta size="lg" />
        </div>

        <p className="hero__note" style={{ '--i': 5 }}>
          <span className="hero__mark hero__mark--muted" aria-hidden="true" />
          Be among the first organizations to deploy private, on-premise AI.
        </p>
      </div>
    </section>
  )
}

export default Hero
