import { useEffect, useRef, useState } from 'react'
import './Header.css'

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Content journey', href: '#content-journey' },
  { label: 'Industries', href: '#industries' },
  { label: 'How it works', href: '#how-it-works' },
]

const CTA_LABEL = 'Design Your Private AI'
const CTA_HREF = '#contact'
const SUPPORT_HREF = '#support'

/* keep in sync with --nav-breakpoint in index.css */
const NAV_QUERY = '(min-width: 1120px)'

function ArrowRight() {
  return (
    <svg viewBox="0 0 15 15" fill="none">
      <path
        d="M2.25 7.5h10.5M8.75 3.75 12.5 7.5l-3.75 3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* two arrows in a masked box: the first leaves right as the second enters */
function ArrowSwap() {
  return (
    <span className="arrow-swap" aria-hidden="true">
      <ArrowRight />
      <ArrowRight />
    </span>
  )
}

function SplitCta({ className = '' }) {
  return (
    <div className={`btn-split ${className}`.trim()}>
      <a className="btn btn--primary btn-split__label" href={CTA_HREF}>
        {CTA_LABEL}
      </a>
      <a
        className="btn btn--primary btn-split__arrow"
        href={CTA_HREF}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ArrowSwap />
      </a>
    </div>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef(null)

  // scrolled state + the blue progress hairline along the bottom edge
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 4)

      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0
      headerRef.current?.style.setProperty('--scroll-progress', String(progress))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // close the panel once the viewport is wide enough for the centered nav
  useEffect(() => {
    const mq = window.matchMedia(NAV_QUERY)
    const sync = (e) => {
      if (e.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.body.classList.add('is-menu-open')
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('is-menu-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      ref={headerRef}
      className={`site-header ${scrolled ? 'is-scrolled' : ''}`.trim()}
    >
      <div className="site-header__inner">
        <a className="brand" href="#top" onClick={closeMenu}>
          Offline<span className="brand__accent">IQ</span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          {NAV_LINKS.map(({ label, href }, i) => (
            <a key={href} className="site-nav__link" href={href} style={{ '--i': i }}>
              {label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--secondary site-header__support" href={SUPPORT_HREF}>
            Support
          </a>

          <SplitCta className="site-header__cta" />

          <button
            type="button"
            className={`hamburger ${menuOpen ? 'is-active' : ''}`.trim()}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="hamburger__bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div className={`site-menu ${menuOpen ? 'is-open' : ''}`.trim()} id="site-menu">
        <nav className="site-menu__nav" aria-label="Mobile">
          {NAV_LINKS.map(({ label, href }, i) => (
            <a
              key={href}
              className="site-menu__link"
              href={href}
              style={{ '--i': i }}
              onClick={closeMenu}
            >
              <span className="site-menu__label">{label}</span>
              <span className="site-menu__chevron" aria-hidden="true">
                <ArrowRight />
              </span>
            </a>
          ))}
        </nav>

        <div className="site-menu__actions" style={{ '--i': NAV_LINKS.length }}>
          <a
            className="btn btn--secondary site-menu__support"
            href={SUPPORT_HREF}
            onClick={closeMenu}
          >
            Support
          </a>
          <SplitCta className="site-menu__cta" />
        </div>
      </div>

      <button
        type="button"
        className={`site-menu__scrim ${menuOpen ? 'is-open' : ''}`.trim()}
        tabIndex={-1}
        aria-hidden="true"
        onClick={closeMenu}
      />
    </header>
  )
}

export default Header
