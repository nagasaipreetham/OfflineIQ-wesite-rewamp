import { useEffect, useState } from 'react'
import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import { SplitCta } from './Button.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import './Contact.css'

const FLIP_WORDS = ['Data', 'AI', 'Intelligence']
const TYPE_MS = 75
const DELETE_MS = 48
const HOLD_MS = 2200
const GAP_MS = 280

const DEFAULT_HEADING = (
  <>
    Every deployment is sized in a{' '}
    <mark className="contact__mark">conversation</mark>, not read off a pricing
    page.
  </>
)

const DEFAULT_DESCRIPTION =
  'What Fort Knox costs depends on how many people are using it and what it\u2019s ingesting. Pilot in days, not months, once we know what we\u2019re building.'

const DEFAULT_LEFT_HEADING = 'Tell us what you\u2019re working with.'

const DEFAULT_CAPTION =
  'Book a discovery call. We\u2019ll scope what Fort Knox needs to look like for the team, and what it takes to get one built.'

function Contact({
  heading = DEFAULT_HEADING,
  description = DEFAULT_DESCRIPTION,
  leftHeading = DEFAULT_LEFT_HEADING,
  caption = DEFAULT_CAPTION,
  numeral = 12,
}) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cancelled = false
    let timeoutId = 0
    let wordIndex = 0
    let charIndex = 0
    let deleting = false

    if (reduceMotion) {
      setDisplayed(FLIP_WORDS[0])
      const id = window.setInterval(() => {
        wordIndex = (wordIndex + 1) % FLIP_WORDS.length
        setDisplayed(FLIP_WORDS[wordIndex])
      }, HOLD_MS)
      return () => window.clearInterval(id)
    }

    const schedule = (fn, ms) => {
      timeoutId = window.setTimeout(fn, ms)
    }

    const tick = () => {
      if (cancelled) return
      const target = FLIP_WORDS[wordIndex]

      if (!deleting) {
        if (charIndex < target.length) {
          charIndex += 1
          setDisplayed(target.slice(0, charIndex))
          schedule(tick, TYPE_MS)
          return
        }
        schedule(() => {
          deleting = true
          tick()
        }, HOLD_MS)
        return
      }

      if (charIndex > 0) {
        charIndex -= 1
        setDisplayed(target.slice(0, charIndex))
        schedule(tick, DELETE_MS)
        return
      }

      deleting = false
      wordIndex = (wordIndex + 1) % FLIP_WORDS.length
      schedule(tick, GAP_MS)
    }

    tick()

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <section className="contact" id="contact">
      <ShellInner>
        <SectionPin>
          <h2 className="contact__title">
            {numeral != null && (
              <span className="contact__num" aria-hidden="true">
                {greekNumeral(numeral)}.
              </span>
            )}
            <span className="contact__label">Contact</span>
          </h2>
          <div className="contact__rule" aria-hidden="true" />
        </SectionPin>

        <div className="contact__intro">
          <h3 className="contact__heading">{heading}</h3>
          {description ? <p className="contact__description">{description}</p> : null}
        </div>

        <div className="contact__split">
          <div className="contact__left">
            <p className="contact__lead" aria-live="polite">
              <span className="contact__lead-fixed">Your</span>{' '}
              <span className="contact__lead-chip">
                <span className="contact__lead-word">{displayed || '\u00a0'}</span>
                <span className="contact__lead-caret" aria-hidden="true" />
              </span>
            </p>
            {leftHeading ? <h4 className="contact__subhead">{leftHeading}</h4> : null}
            {caption ? <p className="contact__caption">{caption}</p> : null}
          </div>

          <div className="contact__right">
            <div className="contact__right-box">
              <SplitCta
                className="contact__cta"
                label="Talk to Our Team"
                href="/consultation"
                size="lg"
              />
            </div>
          </div>
        </div>
      </ShellInner>
    </section>
  )
}

export default Contact
