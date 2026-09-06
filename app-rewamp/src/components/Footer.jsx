import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, useGSAP)

/* Curved “down” shape → flat “center” shape (GSAP Footer bounce demo). */
const PATH_DOWN =
  'M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z'
const PATH_CENTER =
  'M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V683H0V-0.3z'

function Footer() {
  const footerRef = useRef(null)

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
        <path
          className="site-footer__path"
          id="bouncy-path"
          d={PATH_DOWN}
        />
      </svg>
    </footer>
  )
}

export default Footer
