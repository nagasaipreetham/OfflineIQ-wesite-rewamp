import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import AsciiViewer from './AsciiViewer.jsx'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, useGSAP)

const PATH_DOWN =
  'M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z'
const PATH_CENTER =
  'M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V683H0V-0.3z'

const FOOTER_LINKS = [
  { label: 'Support', href: '#support' },
  { label: 'Content journey', href: '#content-journey' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Tools', href: '#tools' },
  { label: 'Use cases', href: '#use-cases' },
  { label: 'Deployment', href: '#deployment' },
  { label: 'Contact', href: '#contact' },
]

function Footer() {
  const footerRef = useRef(null)
  const [brainActive, setBrainActive] = useState(false)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setBrainActive(entry.isIntersecting)
      },
      {
        root: null,
        // Fire as soon as any part of the footer peeks into view
        threshold: 0,
        rootMargin: '0px',
      },
    )

    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  useGSAP(
    () => {
      const footer = footerRef.current
      if (!footer) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        gsap.set('#bouncy-path', { morphSVG: PATH_CENTER })
        return
      }

      ScrollTrigger.create({
        trigger: footer,
        start: 'top bottom',
        toggleActions: 'play pause resume reverse',
        onEnter: (self) => {
          const velocity = self.getVelocity()
          const variation = Math.min(Math.max(velocity / 10000, -0.6), 0.6)

          gsap.fromTo(
            '#bouncy-path',
            { morphSVG: PATH_DOWN },
            {
              duration: 2,
              morphSVG: PATH_CENTER,
              ease: `elastic.out(${1 + variation}, ${1 - variation})`,
              overwrite: 'auto',
            },
          )
        },
      })
    },
    { scope: footerRef },
  )

  return (
    <footer className="site-footer" ref={footerRef} aria-label="Site footer">
      <svg
        className="site-footer__svg"
        id="footer-img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2278 683"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="site-footer__path" id="bouncy-path" d={PATH_DOWN} />
      </svg>

      <div className="site-footer__grid">
        <div className="site-footer__left-top">
          <nav className="site-footer__nav" aria-label="Footer">
            {FOOTER_LINKS.map(({ label, href }) => (
              <a key={href} className="site-footer__nav-link" href={href}>
                {label}
              </a>
            ))}
          </nav>
          <p className="site-footer__copy">&copy; 2026 OfflineIQ. All rights reserved.</p>
          <a className="site-footer__site" href="https://offlineiq.ai">
            offlineiq.ai
          </a>
        </div>

        <div className="site-footer__left-bottom">
          <p className="site-footer__brand">OfflineIQ</p>
          <p className="site-footer__tagline">Private intelligence. Total control.</p>
        </div>

        <div className="site-footer__right">
          {brainActive ? (
            <AsciiViewer
              className="site-footer__brain"
              modelPath="/brain.glb"
              resolution={0.22}
              scale={3.24}
              color="#ffffff"
              backgroundColor="transparent"
              enableControls={false}
            />
          ) : null}
        </div>
      </div>
    </footer>
  )
}

export default Footer
