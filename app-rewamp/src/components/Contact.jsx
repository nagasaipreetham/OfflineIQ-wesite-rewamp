import { useEffect, useState } from 'react'
import { ShellInner } from './Shell.jsx'
import { SplitCta } from './Button.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import './Contact.css'

const FLIP_WORDS = ['Data', 'AI', 'Intelligence']
const TYPE_MS = 75
const DELETE_MS = 48
const HOLD_MS = 2200
const GAP_MS = 280

function Contact() {
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
        <h2 className="contact__title">
          <span className="contact__num" aria-hidden="true">
            {greekNumeral(5)}.
          </span>
          <span className="contact__label">Contact</span>
        </h2>
        <div className="contact__rule" aria-hidden="true" />

        <div className="contact__intro">
          <h3 className="contact__heading">
            <mark className="contact__mark">One Step</mark> Away From Protecting Your
            Data
          </h3>
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
            <p className="contact__caption">
              Your documents, your servers, your control. OfflineIQ helps your team draft,
              review, summarize, and search company files without anything ever leaving your
              network.
            </p>
          </div>

          <div className="contact__right">
            <div className="contact__right-box">
              <SplitCta
                className="contact__cta"
                label="Talk to Our Team"
                href="#contact"
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
