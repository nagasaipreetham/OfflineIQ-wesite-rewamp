import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Shell, { ShellInner } from '../components/Shell.jsx'
import SectionSep from '../components/SectionSep.jsx'
import SectionPin from '../components/SectionPin.jsx'
import Contact from '../components/Contact.jsx'
import { ArrowRight, SplitCta } from '../components/Button.jsx'
import { FORT_KNOX_TIERS } from '../components/MeetFortKnox.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import { usePageMeta } from '../lib/usePageMeta.js'
import './FortKnoxPage.css'

const TITLE = 'Fort Knox | The Air-Gapped AI Appliance | OfflineIQ'
const DESCRIPTION =
  'A sealed AI appliance that runs entirely on your network. Plug-and-play setup, AMD-powered compute, zero internet required.'
const KEYWORDS = 'air-gapped AI hardware appliance, on-premise AI appliance'

const HERO_CHIPS = [
  'Air-gapped',
  'On-premise',
  'Zero internet required',
  'AMD-powered',
]

const CUTAWAY = [
  {
    id: 'cool',
    n: '1',
    title: 'Dedicated cooling',
    body: 'Sized for inference in the room it ships to.',
    x: '45%',
    y: '36%',
    side: 'left',
  },
  {
    id: 'compute',
    n: '2',
    title: 'AMD compute',
    body: 'Deployable silicon, without GPU-vendor licensing that blocks client sites.',
    x: '52%',
    y: '36%',
    side: 'left',
  },
  {
    id: 'storage',
    n: '3',
    title: 'Local storage',
    body: 'The corpus stays in the chassis. Nothing is staged in a vendor cloud.',
    x: '66%',
    y: '38%',
    side: 'right',
  },
  {
    id: 'seal',
    n: '4',
    title: 'Air-gapped chassis',
    body: 'No WAN path. No failover. The client owns the box.',
    x: '80%',
    y: '36%',
    side: 'right',
  },
]

const CONSULT_HREF = '/consultation'

const DEPLOY_STEPS = [
  {
    num: '01',
    title: 'Ships configured',
    body: 'No procurement cycle through a cloud vendor. The unit arrives ready for your network.',
  },
  {
    num: '02',
    title: 'Plug it in',
    body: 'It announces itself on the internal network the moment it is plugged in.',
  },
  {
    num: '03',
    title: 'No client software',
    body: 'Nothing is installed on any device. Teams open a browser inside the environment and work.',
  },
  {
    num: '04',
    title: 'Pilot in days',
    body: 'Not months. Once we know the team and the ingest, a pilot can start in days.',
  },
]

const WILL_NOT = [
  'No cloud model fallback under any circumstance',
  'No web search at inference time',
  'No live connectors to email, calendar, chat, or ticketing systems',
  'No shared training across clients',
  'No auto-send or auto-post, human review on every output',
  'No user accounts managed by OfflineIQ',
]

function Tick({ pos }) {
  return <span className={`fk-tick fk-tick--${pos}`} aria-hidden="true" />
}

function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return undefined

    const nodes = [...root.querySelectorAll('[data-reveal]')]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      nodes.forEach((node) => node.classList.add('is-in'))
      return undefined
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' },
    )

    nodes.forEach((node) => io.observe(node))
    return () => io.disconnect()
  }, [])

  return ref
}

function PinTitle({ n, label }) {
  return (
    <SectionPin>
      <h2 className="fk-pin">
        <span className="fk-pin__num" aria-hidden="true">
          {greekNumeral(n)}.
        </span>
        <span className="fk-pin__label">{label}</span>
      </h2>
      <div className="fk-pin__rule" aria-hidden="true" />
    </SectionPin>
  )
}

export default function FortKnoxPage() {
  const revealRef = useReveal()

  usePageMeta({
    title: TITLE,
    description: DESCRIPTION,
    keywords: KEYWORDS,
    image: '/fort-knox.png',
    path: '/fort-knox',
  })

  const leftCalls = CUTAWAY.filter((item) => item.side === 'left')
  const rightCalls = CUTAWAY.filter((item) => item.side === 'right')

  return (
    <main className="fk" ref={revealRef}>
      <section className="fk-hero" aria-labelledby="fk-hero-title">
        <div className="fk-hero__field" aria-hidden="true" />

        <div className="fk-hero__inner">
          <figure className="fk-hero__shot" style={{ '--i': 0 }}>
            <Tick pos="tl" />
            <Tick pos="tr" />
            <Tick pos="bl" />
            <Tick pos="br" />
            <img
              className="fk-hero__image"
              src="/fortknox-closed.png"
              alt="Fort Knox, the sealed OfflineIQ appliance"
            />
          </figure>

          <div className="fk-hero__copy">
            <p className="fk-hero__badge" style={{ '--i': 1 }}>
              <span className="fk-hero__mark" aria-hidden="true" />
              Air-gapped AI hardware appliance
            </p>

            <h1 className="fk-hero__title" id="fk-hero-title" style={{ '--i': 2 }}>
              The <mark className="fk-hero__highlight">appliance</mark>,
              <span className="fk-hero__title-line">not the promise</span>
            </h1>

            <p className="fk-hero__caption" style={{ '--i': 3 }}>
              A sealed AI appliance that runs entirely on your network. Plug-and-play
              setup, AMD-powered compute, zero internet required.
            </p>

            <ul className="fk-hero__chips" style={{ '--i': 4 }}>
              {HERO_CHIPS.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>

            <div className="fk-hero__actions" style={{ '--i': 5 }}>
              <a className="btn btn--secondary btn--lg" href="#whats-inside">
                What&rsquo;s inside
              </a>
              <SplitCta size="lg" />
            </div>
          </div>
        </div>
      </section>

      <Shell>
        <SectionSep />

        <section className="fk-section" id="what-it-is">
          <ShellInner>
            <PinTitle n={1} label="What it is" />

            <div className="fk-split" data-reveal>
              <div className="fk-visual">
                <Tick pos="tl" />
                <Tick pos="tr" />
                <Tick pos="bl" />
                <Tick pos="br" />
                <img
                  className="fk-visual__image"
                  src="/fort-knox.png"
                  alt="Fort Knox with the chassis open, showing internal compute and storage"
                />
              </div>

              <div className="fk-copy">
                <h3 className="fk-heading">
                  A physical unit. Inside your network, not a cloud account.
                </h3>
                <p className="fk-body">
                  Fort Knox is a physical unit that ships configured and gets placed
                  inside your own network. It is not a cloud account with a hardware
                  add-on. There is no dependency to fail over to, because there is
                  nothing to fail over to. The client owns the box.
                </p>
              </div>
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="fk-section" id="whats-inside">
          <ShellInner>
            <PinTitle n={2} label="What's inside" />

            <div className="fk-intro" data-reveal>
              <h3 className="fk-heading fk-heading--center">
                Built on <mark className="fk-mark">AMD</mark> compute, on purpose.
              </h3>
              <p className="fk-caption">
                Chosen deliberately: commercially deployable hardware without the
                licensing restrictions that block some GPU vendors from client
                deployments.
              </p>
            </div>

            <figure className="fk-cutaway" data-reveal aria-label="Labeled diagram of Fort Knox">
              <ul className="fk-cutaway__side fk-cutaway__side--left">
                {leftCalls.map((item) => (
                  <li key={item.id} className="fk-cutaway__item">
                    <span className="fk-cutaway__n" aria-hidden="true">
                      {item.n}
                    </span>
                    <div>
                      <p className="fk-cutaway__title">{item.title}</p>
                      <p className="fk-cutaway__body">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="fk-cutaway__photo">
                <img
                  className="fk-cutaway__image"
                  src="/fort-knox.png"
                  alt="Cutaway of Fort Knox showing cooling, AMD compute, local storage, and a sealed chassis"
                />
                {CUTAWAY.map((item) => (
                  <span
                    key={item.id}
                    className="fk-cutaway__pin"
                    style={{ '--x': item.x, '--y': item.y }}
                    aria-hidden="true"
                  >
                    {item.n}
                  </span>
                ))}
              </div>

              <ul className="fk-cutaway__side fk-cutaway__side--right">
                {rightCalls.map((item) => (
                  <li key={item.id} className="fk-cutaway__item">
                    <span className="fk-cutaway__n" aria-hidden="true">
                      {item.n}
                    </span>
                    <div>
                      <p className="fk-cutaway__title">{item.title}</p>
                      <p className="fk-cutaway__body">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </figure>

            <div className="fk-amd" data-reveal>
              <img
                className="fk-amd__logo"
                src="/amd-logo.svg"
                alt="AMD"
                width={140}
                height={34}
              />
              <p className="fk-amd__note">Official compute partner</p>
            </div>

            <div className="fk-tiers" data-reveal>
              {FORT_KNOX_TIERS.map((tier) => (
                <article
                  key={tier.id}
                  className={`fk-tier fk-tier--${tier.id}`}
                >
                  <p className="fk-tier__eyebrow">
                    <span className="fk-tier__num" aria-hidden="true">
                      {tier.num}
                    </span>
                    {tier.eyebrow}
                  </p>
                  <h4 className="fk-tier__name">{tier.name}</h4>
                  <ul className="fk-tier__points">
                    {tier.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <Link className="fk-tier__cta" to={CONSULT_HREF}>
                    {tier.cta}
                    <ArrowRight />
                  </Link>
                </article>
              ))}
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="fk-section" id="how-it-deploys">
          <ShellInner>
            <PinTitle n={3} label="How it deploys" />

            <div className="fk-deploy" data-reveal>
              <div className="fk-deploy__copy">
                <h3 className="fk-heading">Pilot in days, not months.</h3>
                <p className="fk-body">
                  No procurement cycle through a cloud vendor. No client software
                  installed on any device. It announces itself on the internal
                  network the moment it&rsquo;s plugged in.
                </p>
              </div>

              <div className="fk-lan" aria-hidden="true">
                <span className="fk-lan__ring" />
                <span className="fk-lan__ring fk-lan__ring--2" />
                <span className="fk-lan__ring fk-lan__ring--3" />
                <img
                  className="fk-lan__image"
                  src="/fortknox-closed.png"
                  alt=""
                />
                <p className="fk-lan__chip">On your LAN</p>
              </div>
            </div>

            <ol className="fk-steps">
              {DEPLOY_STEPS.map((step, i) => (
                <li
                  key={step.num}
                  className="fk-step"
                  data-reveal
                  style={{ '--d': `${i * 70}ms` }}
                >
                  <span className="fk-step__num" aria-hidden="true">
                    {step.num}
                  </span>
                  <h3 className="fk-step__title">{step.title}</h3>
                  <p className="fk-step__body">{step.body}</p>
                </li>
              ))}
            </ol>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="fk-section fk-section--last" id="what-it-will-not-do">
          <ShellInner>
            <PinTitle n={4} label="What it will not do" />

            <div className="fk-intro" data-reveal>
              <h3 className="fk-heading fk-heading--center">
                The list is the architecture.
              </h3>
              <p className="fk-caption">
                These are not settings. They are absences. Fort Knox cannot be
                talked into a cloud path, because the path is not there.
              </p>
            </div>

            <ul className="fk-wont">
              {WILL_NOT.map((item, i) => (
                <li
                  key={item}
                  className="fk-wont__item"
                  data-reveal
                  style={{ '--d': `${i * 50}ms` }}
                >
                  <span className="fk-wont__flag" aria-hidden="true">
                    No
                  </span>
                  <p>{item.replace(/^No\s/, '')}</p>
                </li>
              ))}
            </ul>

            <div className="fk-endcta" data-reveal>
              <SplitCta size="lg" />
            </div>
          </ShellInner>
        </section>

        <SectionSep />
        <Contact numeral={5} />
      </Shell>
    </main>
  )
}
