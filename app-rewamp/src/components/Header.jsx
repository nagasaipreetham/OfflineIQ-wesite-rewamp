import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, SplitCta } from './Button.jsx'
import './Header.css'

const THEMES = [
  { id: 'olive', color: '#343e36', label: 'Olive theme' },
  { id: 'terracotta', color: '#c77255', label: 'Terracotta theme' },
]

const THEME_KEY = 'oiq-theme'

function readTheme() {
  if (typeof document === 'undefined') return 'terracotta'
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'olive' || attr === 'terracotta') return attr
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'olive' || stored === 'terracotta') return stored
  } catch {
    /* ignore */
  }
  return 'terracotta'
}

function applyTheme(id) {
  document.documentElement.setAttribute('data-theme', id)
  try {
    localStorage.setItem(THEME_KEY, id)
  } catch {
    /* ignore */
  }
}

function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme)

  const select = (id) => {
    setTheme(id)
    applyTheme(id)
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Colour theme">
      {THEMES.map(({ id, color, label }) => (
        <button
          key={id}
          type="button"
          className={`theme-toggle__swatch${theme === id ? ' is-active' : ''}`}
          style={{ '--swatch': color }}
          aria-label={label}
          aria-pressed={theme === id}
          onClick={() => select(id)}
        />
      ))}
    </div>
  )
}

const NAV_LINKS = [
  { label: 'Product', to: '/#meet-fort-knox' },
  { label: 'Content journey', to: '/content-journey' },
  { label: 'Industries', to: '/#industries' },
  { label: 'The Digital Twin', to: '/#how-it-works' },
]

const SUPPORT_TO = '/support'

/* keep in sync with --nav-breakpoint in index.css */
const NAV_QUERY = '(min-width: 1120px)'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef(null)

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
        <Link className="brand" to="/" onClick={closeMenu}>
          Offline<span className="brand__accent">IQ</span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {NAV_LINKS.map(({ label, to }, i) => (
            <Link key={to} className="site-nav__link" to={to} style={{ '--i': i }}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link className="btn btn--secondary site-header__support" to={SUPPORT_TO}>
            Support
          </Link>

          <SplitCta className="site-header__cta" href="/consultation" />

          <ThemeToggle />

          <button
            type="button"
            className={`hamburger tick-frame ${menuOpen ? 'is-active' : ''}`.trim()}
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
          {NAV_LINKS.map(({ label, to }, i) => (
            <Link
              key={to}
              className="site-menu__link"
              to={to}
              style={{ '--i': i }}
              onClick={closeMenu}
            >
              <span className="site-menu__label">{label}</span>
              <span className="site-menu__chevron" aria-hidden="true">
                <ArrowRight />
              </span>
            </Link>
          ))}
        </nav>

        <div className="site-menu__actions" style={{ '--i': NAV_LINKS.length }}>
          <Link
            className="btn btn--secondary site-menu__support"
            to={SUPPORT_TO}
            onClick={closeMenu}
          >
            Support
          </Link>
          <SplitCta
            className="site-menu__cta"
            href="/consultation"
            onClick={closeMenu}
          />
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
