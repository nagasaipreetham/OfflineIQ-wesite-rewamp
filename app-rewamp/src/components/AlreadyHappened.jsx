import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import { ArrowRight } from './Button.jsx'
import './AlreadyHappened.css'

const SLIDES = [
  {
    src: '/it-already-happened/proof1.webp',
    href: 'https://www.forbes.com/sites/siladityaray/2023/05/02/samsung-bans-chatgpt-and-other-chatbots-for-employees-after-sensitive-code-leak/',
    alt: 'Samsung, 2023 — engineers pasted internal source code into ChatGPT',
  },
  {
    src: '/it-already-happened/proof2.webp',
    href: 'https://blog.checkpoint.com/research/when-ai-trust-breaks-the-chatgpt-data-leakage-flaw-that-redefined-ai-vendor-security-trust/',
    alt: 'OpenAI, patched February 2026 — conversation content leaked through DNS queries',
  },
  {
    src: '/it-already-happened/proof3.webp',
    href: 'https://techcrunch.com/2023/08/08/zoom-data-mining-for-ai-terms-gdpr-eprivacy/',
    alt: 'Zoom, 2023 — terms updated to allow training AI on customer audio and video',
  },
  {
    src: '/it-already-happened/proof4.webp',
    href: 'https://www.securityweek.com/user-outcry-as-slack-scrapes-customer-data-for-ai-model-training/',
    alt: 'Slack, 2024 — customer messages scraped to train models by default',
  },
]

function AlreadyHappened() {
  const pinRef = useRef(null)
  const viewRef = useRef(null)
  const filmRef = useRef(null)
  const shiftRef = useRef(0)
  const reduceRef = useRef(false)

  useLayoutEffect(() => {
    const pin = pinRef.current
    const view = viewRef.current
    const film = filmRef.current
    if (!pin || !view || !film) return undefined

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncReduce = () => {
      reduceRef.current = mq.matches
      pin.classList.toggle('is-static', mq.matches)
    }
    syncReduce()
    mq.addEventListener('change', syncReduce)

    let target = 0
    let current = 0
    let raf = 0
    let running = false

    const apply = (x) => {
      film.style.transform = `translate3d(${-x}px, 0, 0)`
    }

    const measure = () => {
      if (reduceRef.current) {
        pin.style.removeProperty('--happened-extra')
        pin.style.height = ''
        shiftRef.current = 0
        target = 0
        current = 0
        film.style.transform = ''
        return 0
      }
      const shift = Math.max(0, film.scrollWidth - view.clientWidth)
      shiftRef.current = shift
      if (shift > 0) {
        pin.style.setProperty('--happened-extra', `${Math.ceil(shift)}px`)
      }
      return shift
    }

    const readTarget = () => {
      const shift = shiftRef.current
      if (reduceRef.current || shift <= 0) {
        target = 0
        return
      }
      const header = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
      ) || 62
      const pinTop = header + 44
      const raw = pinTop - pin.getBoundingClientRect().top
      const progress = Math.min(1, Math.max(0, raw / shift))
      target = progress * shift
    }

    const tick = () => {
      const delta = target - current
      if (Math.abs(delta) < 0.2) {
        current = target
        apply(current)
        running = false
        raf = 0
        return
      }
      current += delta * 0.16
      apply(current)
      raf = window.requestAnimationFrame(tick)
    }

    const kick = () => {
      readTarget()
      if (reduceRef.current) {
        current = target
        apply(current)
        return
      }
      if (!running) {
        running = true
        raf = window.requestAnimationFrame(tick)
      }
    }

    measure()
    kick()
    const boot = window.requestAnimationFrame(() => {
      measure()
      kick()
    })

    const ro = new ResizeObserver(() => {
      measure()
      kick()
    })
    ro.observe(view)
    ro.observe(film)
    const onResize = () => {
      measure()
      kick()
    }

    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', onResize)

    const images = [...film.querySelectorAll('img')]
    const onImg = () => {
      measure()
      kick()
    }
    images.forEach((img) => {
      if (img.complete) return
      img.addEventListener('load', onImg)
    })

    return () => {
      window.cancelAnimationFrame(boot)
      window.cancelAnimationFrame(raf)
      mq.removeEventListener('change', syncReduce)
      ro.disconnect()
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', onResize)
      images.forEach((img) => img.removeEventListener('load', onImg))
    }
  }, [])

  return (
    <section className="happened" id="already-happened">
      <ShellInner>
        <SectionPin>
          <h2 className="happened__title">
            <span className="happened__label">It&rsquo;s already happened</span>
          </h2>
          <div className="happened__rule" aria-hidden="true" />
        </SectionPin>

        <div className="happened__pin" ref={pinRef}>
          <div className="happened__sticky">
            <div className="happened__intro">
              <h3 className="happened__heading">
                This isn&rsquo;t <mark className="happened__mark">Hypothetical</mark>
              </h3>
            </div>
            <div className="happened__viewport" ref={viewRef}>
              <div className="happened__film" ref={filmRef}>
                {SLIDES.map((slide) => (
                  <a
                    key={slide.src}
                    className="happened__shot"
                    href={slide.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={slide.src} alt={slide.alt} />
                  </a>
                ))}
              </div>
            </div>
            <div className="happened__more">
              <Link className="happened__more-link" to="/security">
                See the full record
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </ShellInner>
    </section>
  )
}

export default AlreadyHappened
