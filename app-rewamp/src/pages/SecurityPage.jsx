import { useEffect, useRef, useState } from 'react'
import Shell, { ShellInner } from '../components/Shell.jsx'
import SectionSep from '../components/SectionSep.jsx'
import SectionPin from '../components/SectionPin.jsx'
import Contact from '../components/Contact.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import { usePageMeta } from '../lib/usePageMeta.js'
import './SecurityPage.css'

const TITLE = 'Security & Compliance | Zero-Egress AI Architecture | OfflineIQ'
const DESCRIPTION =
  "See exactly what Fort Knox does and doesn't do. No cloud fallback, no external calls, full audit log. Documented industry incidents included."
const KEYWORDS = 'zero-egress AI architecture, AI compliance for regulated industries'

const ASK = 'Find the approved clinical protocol for discharge review.'
const REPLY =
  'Here is the approved discharge review protocol from your internal documents.'

const LOCAL_SOURCES = [
  'Clinical-Protocol.pdf',
  'Policy-4.2.docx',
  'SOP-3024.pdf',
]

const LAYERS = [
  { title: 'OS network policy', detail: 'No external routes', icon: 'net' },
  { title: 'Container runtime', detail: 'Isolated execution', icon: 'crate' },
  { title: 'Application layer', detail: 'No outbound integrations', icon: 'app' },
]

const NODES = [
  { title: 'Documents', icon: 'doc' },
  { title: 'Queries', icon: 'query' },
  { title: 'Embeddings', icon: 'grid' },
  { title: 'Model output', icon: 'out' },
]

const EXTERNALS = [
  { title: 'Cloud providers', icon: 'cloud' },
  { title: 'Web search', icon: 'search' },
  { title: 'External APIs', icon: 'plug' },
  { title: 'Third-party services', icon: 'boxes' },
]

const PILLS = [
  'No cloud model fallback',
  'No web search at inference',
  'No outbound API calls',
  'No shared training',
  'Human review on every output',
]

const WILL_NOT = [
  'No cloud model fallback under any circumstance',
  'No web search at inference time',
  'No live connectors to email, calendar, chat, or ticketing systems',
  'No shared training across clients',
  'No auto-send or auto-post, human review on every output',
  'No user accounts managed by OfflineIQ',
]

const LOGS = [
  { t: '10:24:01', act: 'Ingest', detail: 'Clinical-Protocol.pdf', state: 'Sealed' },
  { t: '10:24:08', act: 'Query', detail: 'Discharge review protocol', state: 'Local' },
  { t: '10:24:11', act: 'Retrieve', detail: '3 internal sources', state: 'Hashed' },
  { t: '10:24:14', act: 'Generate', detail: 'Cited answer', state: 'Grounded' },
  { t: '10:24:14', act: 'Review', detail: 'Human gate on every output', state: 'Required' },
]

const CITES = [
  {
    mark: 'a',
    file: 'Clinical-Protocol.pdf',
    clause: '§4.1 Discharge review',
    hash: '9f2c…a17e',
  },
  {
    mark: 'b',
    file: 'Policy-4.2.docx',
    clause: 'Clause 4.2 Human review',
    hash: 'c81b…44d0',
  },
  {
    mark: 'c',
    file: 'SOP-3024.pdf',
    clause: 'SOP 3024 · step 6',
    hash: 'e03a…12c8',
  },
]

const RECORD = [
  {
    lane: 'Exposed',
    items: [
      {
        num: '1',
        title: 'Samsung, 2023',
        body: 'Engineers uploaded internal source code and confidential meeting notes to ChatGPT. A company-wide ban followed.',
        sources: [
          {
            label: 'Forbes',
            href: 'https://www.forbes.com/sites/siladityaray/2023/05/02/samsung-bans-chatgpt-and-other-chatbots-for-employees-after-sensitive-code-leak/',
          },
          {
            label: 'CIO Dive',
            href: 'https://www.ciodive.com/news/Samsung-Electronics-ChatGPT-leak-data-privacy/647137/',
          },
          {
            label: 'AI Incident Database #768',
            href: 'https://incidentdatabase.ai/cite/768/',
          },
        ],
      },
      {
        num: '2',
        title: 'OpenAI, patched February 2026',
        body: 'A DNS-based exfiltration flaw pulled conversation content, files, and summaries out silently. No user mistake required.',
        sources: [
          {
            label: 'Check Point Research',
            href: 'https://blog.checkpoint.com/research/when-ai-trust-breaks-the-chatgpt-data-leakage-flaw-that-redefined-ai-vendor-security-trust/',
          },
          {
            label: 'The Hacker News',
            href: 'https://thehackernews.com/2026/03/openai-patches-chatgpt-data.html',
          },
        ],
      },
      {
        num: '3',
        title: 'Chat & Ask AI (Codeway), February 2026',
        body: 'A Firebase misconfiguration exposed 300 million messages from 25 million users.',
        sources: [
          {
            label: 'Malwarebytes',
            href: 'https://www.malwarebytes.com/blog/news/2026/02/ai-chat-app-leak-exposes-300-million-messages-tied-to-25-million-users',
          },
        ],
      },
    ],
  },
  {
    lane: 'Repurposed',
    items: [
      {
        num: '1',
        title: 'Zoom, 2023',
        body: 'Terms updated to allow training on customer audio and video. Reversed after backlash.',
        sources: [
          {
            label: 'TechCrunch',
            href: 'https://techcrunch.com/2023/08/08/zoom-data-mining-for-ai-terms-gdpr-eprivacy/',
          },
        ],
      },
      {
        num: '2',
        title: 'Slack, 2024',
        body: 'Scraped customer messages for training by default. The opt-out existed. Almost nobody found it.',
        sources: [
          {
            label: 'SecurityWeek',
            href: 'https://www.securityweek.com/user-outcry-as-slack-scrapes-customer-data-for-ai-model-training/',
          },
        ],
      },
      {
        num: '3',
        title: 'LinkedIn, 2024',
        body: 'Default opt-in to AI training across 930M+ users, suspended in the UK only.',
        sources: [
          {
            label: 'PYMNTS',
            href: 'https://www.pymnts.com/artificial-intelligence-2/2024/linkedins-930-million-users-unknowingly-train-ai-sparking-data-privacy-concerns/',
          },
        ],
      },
      {
        num: '4',
        title: 'Adobe, 2024',
        body: 'Terms implied broad training rights. Publicly reversed after outrage.',
        sources: [
          {
            label: 'Malwarebytes',
            href: 'https://www.malwarebytes.com/blog/news/2024/06/no-ai-training-in-newly-distrusted-terms-of-service-adobe-says',
          },
        ],
      },
      {
        num: '5',
        title: 'Meta, 2024',
        body: 'Paused AI training on EU user data only, after Irish DPC intervention.',
        sources: [
          {
            label: 'TechCrunch',
            href: 'https://techcrunch.com/2024/06/14/meta-pauses-plans-to-train-ai-using-european-users-data-bowing-to-regulatory-pressure/',
          },
        ],
      },
      {
        num: '6',
        title: 'Google Bard/Gemini, 2023',
        body: 'Confirmed that human contractors could read submitted conversations.',
        sources: [
          {
            label: 'Tech Startups',
            href: 'https://techstartups.com/2023/10/23/google-bard-now-includes-human-reviewers-who-may-read-your-conversations-dont-enter-sensitive-info-google-says/',
          },
        ],
      },
      {
        num: '7',
        title: 'X/Grok, 2024',
        body: 'Privacy policy changed to allow third-party training on user posts by default, halted for EU users only.',
        sources: [
          {
            label: 'TechCrunch',
            href: 'https://techcrunch.com/2024/07/26/privacy-watchdog-says-its-surprised-by-elon-musk-opting-user-data-into-grok-ai-training/',
          },
        ],
      },
    ],
  },
]

const ASK_MS = 32
const REPLY_MS = 20

function PinTitle({ n, label }) {
  return (
    <SectionPin>
      <h2 className="sc-pin">
        <span className="sc-pin__num" aria-hidden="true">
          {greekNumeral(n)}.
        </span>
        <span className="sc-pin__label">{label}</span>
      </h2>
      <div className="sc-pin__rule" aria-hidden="true" />
    </SectionPin>
  )
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
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((node) => io.observe(node))
    return () => io.disconnect()
  }, [])

  return ref
}

function useClock() {
  const [value, setValue] = useState('10:24 AM')

  useEffect(() => {
    const tick = () => {
      setValue(
        new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }),
      )
    }
    tick()
    const id = window.setInterval(tick, 15000)
    return () => window.clearInterval(id)
  }, [])

  return value
}

function ReloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.2-5.5" />
      <path d="M20 4.5V8.8h-4.3" />
    </svg>
  )
}

function Glyph({ name }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.7',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M12 3 5 6.2v5.3c0 4.4 3 7.4 7 8.7 4-1.3 7-4.3 7-8.7V6.2Z" />
        <path {...common} d="M9.2 12.1 11.1 14l3.7-4.2" />
      </svg>
    )
  }
  if (name === 'building') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M4 20V7.5L12 4l8 3.5V20" />
        <path {...common} d="M9 20v-6h6v6M9 10h.01M12 10h.01M15 10h.01M9 13h.01M12 13h.01M15 13h.01" />
      </svg>
    )
  }
  if (name === 'cloud') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M7.2 17.5h9.4A3.9 3.9 0 0 0 20 11.8 5.2 5.2 0 0 0 10.4 10 3.7 3.7 0 0 0 7.2 17.5Z" />
      </svg>
    )
  }
  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle {...common} cx="11" cy="11" r="6.2" />
        <path {...common} d="m20 20-3.6-3.6" />
      </svg>
    )
  }
  if (name === 'plug') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M9 7V3M15 7V3M8 7h8v5.2A5 5 0 0 1 12 17a5 5 0 0 1-4-4.8V7Z" />
        <path {...common} d="M12 17v4" />
      </svg>
    )
  }
  if (name === 'boxes') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M4 8.5 12 4l8 4.5-8 4.5Z" />
        <path {...common} d="M4 8.5v7L12 20M20 8.5v7L12 20M12 13v7" />
      </svg>
    )
  }
  if (name === 'doc') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M7 3.8h7.2L18.5 8v12.2H7Z" />
        <path {...common} d="M14.2 3.8V8h4.3M9.4 12.2h6.2M9.4 15.4h4.4" />
      </svg>
    )
  }
  if (name === 'query') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M5 6.2h14v9.2H9.2L5 18.8Z" />
      </svg>
    )
  }
  if (name === 'grid') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect {...common} x="4.5" y="4.5" width="6.2" height="6.2" />
        <rect {...common} x="13.3" y="4.5" width="6.2" height="6.2" />
        <rect {...common} x="4.5" y="13.3" width="6.2" height="6.2" />
        <rect {...common} x="13.3" y="13.3" width="6.2" height="6.2" />
      </svg>
    )
  }
  if (name === 'out') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M6 4.8h12v14.4H6Z" />
        <path {...common} d="M9 9h6M9 12.2h6M9 15.4h3.4" />
      </svg>
    )
  }
  if (name === 'net') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M5 12h14M7.2 8.2A6.2 6.2 0 0 1 12 6.8a6.2 6.2 0 0 1 4.8 1.4M4.4 16.2A9 9 0 0 1 12 13.6a9 9 0 0 1 7.6 2.6M4 5l16 14" />
      </svg>
    )
  }
  if (name === 'crate') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M12 3.2 20 7.4v9.2L12 20.8 4 16.6V7.4Z" />
        <path {...common} d="M12 20.8V12M20 7.4 12 12 4 7.4" />
      </svg>
    )
  }
  if (name === 'app') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M5 6.2h14v12H5Z" />
        <path {...common} d="M5 9.4h14M8 6.2v3.2" />
      </svg>
    )
  }
  if (name === 'arrow') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M5 12h14M13 6.5 19.5 12 13 17.5" />
      </svg>
    )
  }
  if (name === 'loop') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M4.2 12A5.4 5.4 0 0 1 13.4 8.2L15 10H9.2" />
        <path {...common} d="M19.8 12A5.4 5.4 0 0 1 10.6 15.8L9 14h5.8" />
      </svg>
    )
  }
  if (name === 'spark') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 1.2 9.05 6.3 14.4 7.2 9.05 8.1 8 13.2 6.95 8.1 1.6 7.2 6.95 6.3Z"
        />
      </svg>
    )
  }
  if (name === 'user') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle {...common} cx="12" cy="8.2" r="3.1" />
        <path {...common} d="M5.4 18.6c1.3-3 3.6-4.4 6.6-4.4s5.3 1.4 6.6 4.4" />
      </svg>
    )
  }
  if (name === 'check') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle {...common} cx="8" cy="8" r="6.2" />
        <path {...common} d="M5.3 8.15 7.15 10l3.55-4.05" />
      </svg>
    )
  }
  if (name === 'lock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect {...common} x="5.2" y="11" width="13.6" height="9.2" />
        <path {...common} d="M8 11V8.2A4 4 0 0 1 16 8.2V11" />
      </svg>
    )
  }
  if (name === 'cut') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M5 12h5.2M13.8 12H19" />
        <circle {...common} cx="12" cy="12" r="2.1" />
      </svg>
    )
  }
  return null
}

function SourceArrow() {
  return (
    <svg className="sc-record__arrow" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="M2 8L8 2M8 2H3.5M8 2V6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ZeroEgressBoard() {
  const timers = useRef([])
  const raf = useRef(0)
  const [runId, setRunId] = useState(0)
  const [stacked, setStacked] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [ask, setAsk] = useState('')
  const [reply, setReply] = useState('')
  const [layersN, setLayersN] = useState(0)
  const [inside, setInside] = useState(0)
  const clock = useClock()

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    if (raf.current) {
      window.cancelAnimationFrame(raf.current)
      raf.current = 0
    }
  }

  const later = (fn, ms) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1100px)')
    const sync = () => setStacked(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      setAsk(ASK)
      setReply(REPLY)
      setLayersN(3)
      setInside(100)
      setPhase('hold')
      return undefined
    }

    let cancelled = false

    const countTo = (set, to, ms) => {
      const start = performance.now()
      const step = (now) => {
        if (cancelled) return
        const t = Math.min(1, (now - start) / ms)
        set(Math.round(to * t))
        if (t < 1) raf.current = window.requestAnimationFrame(step)
      }
      raf.current = window.requestAnimationFrame(step)
    }

    const run = () => {
      if (cancelled) return
      clearTimers()
      setPhase('layers')
      setAsk('')
      setReply('')
      setLayersN(0)
      setInside(0)

      later(() => setPhase('pipe'), 1100)
      later(() => setPhase('probe'), 2400)
      later(() => setPhase('block'), 3280)
      later(() => setPhase('pills'), 3920)
      later(() => {
        setPhase('local')
        let i = 0
        const typeAsk = () => {
          if (cancelled) return
          i += 1
          setAsk(ASK.slice(0, i))
          if (i < ASK.length) later(typeAsk, ASK_MS)
          else {
            later(() => {
              let r = 0
              const typeReply = () => {
                if (cancelled) return
                r += 1
                setReply(REPLY.slice(0, r))
                if (r < REPLY.length) later(typeReply, REPLY_MS)
                else {
                  later(() => {
                    setPhase('stats')
                    setLayersN(0)
                    setInside(0)
                    later(() => setLayersN(3), 220)
                    countTo(setInside, 100, 920)
                    later(() => setPhase('hold'), 1400)
                  }, 640)
                }
              }
              typeReply()
            }, 380)
          }
        }
        typeAsk()
      }, 4680)
    }

    later(run, runId === 0 ? 380 : 90)
    return () => {
      cancelled = true
      clearTimers()
    }
  }, [runId])

  const showLocal =
    phase === 'local' || phase === 'stats' || phase === 'hold'
  const showReply = reply.length > 0 || phase === 'stats' || phase === 'hold'
  const showSources = reply.length === REPLY.length || phase === 'stats' || phase === 'hold'
  const showStats = phase === 'stats' || phase === 'hold'
  const routes = 0
  const layersShown = phase === 'hold' ? 3 : layersN
  const insideShown = phase === 'hold' ? 100 : inside

  return (
    <section
      className={`sc-hero is-${phase}${stacked ? ' is-stack' : ''}`}
      aria-label="Zero-egress architecture"
    >
      <span className="sc-hero__tick sc-hero__tick--tl" aria-hidden="true" />
      <span className="sc-hero__tick sc-hero__tick--tr" aria-hidden="true" />
      <span className="sc-hero__tick sc-hero__tick--bl" aria-hidden="true" />
      <span className="sc-hero__tick sc-hero__tick--br" aria-hidden="true" />

      <p className="sc-hero__brand">OfflineIQ</p>
      <p className="sc-hero__brand sc-hero__brand--right">Private AI. Real work.</p>

      <div className="sc-hero__grid">
        <div className="sc-hero__copy">
          <p className="sc-hero__kicker">Security &amp; Compliance</p>
          <h1 className="sc-hero__title">
            Not a policy promise.
            <span className="sc-hero__title-line">
              <mark className="sc-hero__mark">An architecture.</mark>
            </span>
          </h1>
          <p className="sc-hero__lede">
            The route to the outside world doesn&rsquo;t exist.
          </p>
          <p className="sc-hero__body">
            OfflineIQ is built to keep your data, queries, and answers inside
            your environment &mdash; by design, not by policy.
          </p>
          <p className="sc-hero__note">
            Architected for confidence.
            <br />
            Built for what matters.
          </p>
        </div>

        <div className="sc-hero__stage">
          <article className="sc-bound">
            <header className="sc-bound__head">
              <p>
                <Glyph name="shield" />
                Zero-egress boundary
              </p>
              <span>Enforced at every layer</span>
            </header>

            <div className="sc-bound__body">
              <div className="sc-bound__env">
                <p className="sc-bound__label">
                  <span>
                    <Glyph name="building" />
                    Your environment
                  </span>
                  <time dateTime={clock}>{clock}</time>
                </p>
                <ul className="sc-bound__layers">
                  {LAYERS.map((layer) => (
                    <li key={layer.title} className="sc-bound__layer">
                      <Glyph name={layer.icon} />
                      <div>
                        <strong>{layer.title}</strong>
                        <small>{layer.detail}</small>
                      </div>
                    </li>
                  ))}
                </ul>
                <span className="sc-bound__feed" aria-hidden="true">
                  <Glyph name="arrow" />
                </span>
              </div>

              <div className="sc-bound__pipe">
                <div className="sc-bound__chamber">
                  <p className="sc-bound__oiq">
                    <Glyph name="spark" />
                    <span>
                      OfflineIQ
                      <small>Your data. Your AI.</small>
                    </span>
                  </p>
                  <div className="sc-bound__track">
                    {NODES.map((node, i) => (
                      <div key={node.title} className="sc-bound__step">
                        <div className="sc-bound__node" style={{ '--i': i }}>
                          <Glyph name={node.icon} />
                          <strong>{node.title}</strong>
                        </div>
                        {i < NODES.length - 1 ? (
                          <span
                            className="sc-bound__hop"
                            style={{ '--i': i }}
                            aria-hidden="true"
                          >
                            <Glyph name="arrow" />
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <span className="sc-bound__egress" aria-hidden="true" />
                  <p className="sc-bound__loop">
                    <Glyph name="loop" />
                    All processing stays inside your environment
                  </p>
                </div>
              </div>

              <div className="sc-bound__wall" aria-label="No outbound route">
                <b>No outbound route</b>
                <i className="sc-bound__x" aria-hidden="true">
                  ×
                </i>
              </div>

              <div className="sc-bound__out">
                <p className="sc-bound__label">
                  <span>
                    <Glyph name="cloud" />
                    External world
                  </span>
                </p>
                <span className="sc-bound__denied" aria-hidden="true">
                  <Glyph name="arrow" />
                </span>
                <ul className="sc-bound__exts">
                  {EXTERNALS.map((item) => (
                    <li key={item.title} className="sc-bound__ext">
                      <Glyph name={item.icon} />
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <ul className="sc-pills">
            {PILLS.map((pill) => (
              <li key={pill}>{pill}</li>
            ))}
          </ul>

          <div className="sc-hero__bottom">
            <article className={`sc-local${showLocal ? ' is-on' : ''}`}>
              <header>
                <span>Works locally</span>
                <time dateTime={clock}>{clock}</time>
              </header>
              <div className="sc-local__row">
                <Glyph name="user" />
                <div>
                  <small>Your question</small>
                  <p>
                    {ask}
                    {phase === 'local' && ask.length < ASK.length ? (
                      <b className="sc-hero__caret" />
                    ) : null}
                  </p>
                </div>
              </div>
              <div className={`sc-local__row sc-local__row--ai${showReply ? ' is-on' : ''}`}>
                <Glyph name="spark" />
                <div>
                  <small>OfflineIQ</small>
                  <p>
                    {reply}
                    {phase === 'local' &&
                    ask.length === ASK.length &&
                    reply.length < REPLY.length ? (
                      <b className="sc-hero__caret" />
                    ) : null}
                  </p>
                </div>
              </div>
              <footer
                className={showSources ? 'is-on' : ''}
                aria-hidden={!showSources}
              >
                <span>
                  <Glyph name="check" />
                  Grounded in 3 sources
                </span>
                <ul>
                  {LOCAL_SOURCES.map((file) => (
                    <li key={file}>{file}</li>
                  ))}
                </ul>
              </footer>
            </article>

            <div className={`sc-stats${showStats ? ' is-on' : ''}`}>
              <div>
                <b>{routes}</b>
                <span>outbound routes</span>
              </div>
              <div>
                <b>{layersShown}</b>
                <span>enforcement layers</span>
              </div>
              <div>
                <b>
                  {insideShown}
                  <small>%</small>
                </b>
                <span>inside your environment</span>
              </div>
              <p>Your data never leaves. Because there is nowhere for it to go.</p>
            </div>
          </div>
        </div>
      </div>

      {phase === 'hold' ? (
        <button
          type="button"
          className="sc-hero__reload"
          aria-label="Replay the zero-egress simulation"
          onClick={() => {
            clearTimers()
            setPhase('idle')
            setAsk('')
            setReply('')
            setLayersN(0)
            setInside(0)
            setRunId((n) => n + 1)
          }}
        >
          <ReloadIcon />
        </button>
      ) : null}

      <p className="sc-hero__rail">Your data. Your AI. Your intelligence.</p>
      <p className="sc-hero__rail sc-hero__rail--right">
        Architected for confidence.
      </p>
    </section>
  )
}

export default function SecurityPage() {
  const revealRef = useReveal()

  usePageMeta({
    title: TITLE,
    description: DESCRIPTION,
    keywords: KEYWORDS,
    image: '/fort-knox.png',
    path: '/security',
  })

  return (
    <main className="sc" ref={revealRef}>
      <ZeroEgressBoard />

      <Shell>
        <SectionSep />

        <section className="sc-section" id="guarantee">
          <ShellInner>
            <PinTitle n={1} label="The Guarantee" />
            <div className="sc-split" data-reveal>
              <div>
                <h3 className="sc-heading">The route doesn&rsquo;t exist.</h3>
                <p className="sc-body">
                  There is no network route from Fort Knox to the outside world
                  during operation. Not a firewall rule, not a setting, not a
                  policy anyone has to remember to follow. The route doesn&rsquo;t
                  exist.
                </p>
              </div>
              <div className="sc-cut" aria-hidden="true">
                <div className="sc-cut__box">
                  <Glyph name="shield" />
                  <strong>Fort Knox</strong>
                  <small>Inside your network</small>
                </div>
                <div className="sc-cut__gap">
                  <span />
                  <i>
                    <Glyph name="cut" />
                  </i>
                  <span />
                  <b>No route</b>
                </div>
                <div className="sc-cut__box sc-cut__box--ghost">
                  <Glyph name="cloud" />
                  <strong>Outside world</strong>
                  <small>Unreachable</small>
                </div>
              </div>
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="sc-section" id="will-not">
          <ShellInner>
            <PinTitle n={2} label="What Fort Knox will not do" />
            <div className="sc-intro" data-reveal>
              <h3 className="sc-heading sc-heading--center">
                Absences, not <mark className="sc-mark">settings</mark>
              </h3>
              <p className="sc-caption">
                These are not policies someone has to remember. Fort Knox
                cannot be talked into a cloud path, because the path is not
                there.
              </p>
            </div>
            <ul className="sc-wont">
              {WILL_NOT.map((item, i) => (
                <li
                  key={item}
                  className="sc-wont__item"
                  data-reveal
                  style={{ '--d': `${i * 50}ms` }}
                >
                  <span className="sc-wont__flag" aria-hidden="true">
                    No
                  </span>
                  <p>{item.replace(/^No\s/, '')}</p>
                </li>
              ))}
            </ul>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="sc-section" id="shows-work">
          <ShellInner>
            <PinTitle n={3} label="Every answer shows its work" />
            <div className="sc-split sc-split--cite" data-reveal>
              <div>
                <h3 className="sc-heading">
                  A mechanism for checking, not a claim about trust.
                </h3>
                <p className="sc-body">
                  Every response carries a confidence indicator, grounded
                  strongly in corroborating sources, or flagged for independent
                  review. Every citation traces to the exact clause it came
                  from, fingerprinted so the trail can&rsquo;t be quietly altered
                  after the fact. That&rsquo;s not a claim about trustworthiness.
                  It&rsquo;s a mechanism for checking it.
                </p>
              </div>
              <aside className="sc-cite" aria-label="Cited answer">
                <p className="sc-cite__conf">
                  <b>92%</b>
                  <span>Grounded in 3 sources</span>
                </p>
                <ul>
                  {CITES.map((item) => (
                    <li key={item.file}>
                      <span className={`sc-cite__n sc-cite__n--${item.mark}`}>
                        {item.mark}
                      </span>
                      <div>
                        <strong>{item.file}</strong>
                        <small>{item.clause}</small>
                        <code>{item.hash}</code>
                      </div>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="sc-section" id="audit">
          <ShellInner>
            <PinTitle n={4} label="The Audit Layer" />
            <div className="sc-intro" data-reveal>
              <h3 className="sc-heading sc-heading--center">
                Logged. Tamper-evident. <mark className="sc-mark">Inside</mark>
              </h3>
              <p className="sc-caption">
                Every action across every agent is logged, tamper-evident,
                reviewable, and stays inside the network like everything else.
              </p>
            </div>
            <div className="sc-log" data-reveal>
              <header>
                <span>Audit log</span>
                <small>Stays on-network · append-only</small>
              </header>
              <ol>
                {LOGS.map((row) => (
                  <li key={`${row.t}-${row.act}`}>
                    <time>{row.t}</time>
                    <b>{row.act}</b>
                    <span>{row.detail}</span>
                    <em>{row.state}</em>
                  </li>
                ))}
              </ol>
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="sc-section sc-section--last" id="record">
          <ShellInner>
            <PinTitle n={5} label="The Full Record" />
            <div className="sc-intro" data-reveal>
              <h3 className="sc-heading sc-heading--center">
                This isn&rsquo;t <mark className="sc-mark">hypothetical</mark>
              </h3>
              <p className="sc-caption">
                Cloud AI products have already leaked work, trained on it, or
                both. Every item below is sourced.
              </p>
            </div>

            <div className="sc-record">
              {RECORD.map((column) => (
                <article
                  key={column.lane}
                  className="sc-record__table"
                  data-reveal
                >
                  <p className="sc-record__lane">{column.lane}</p>
                  <div
                    className={`sc-record__grid sc-record__grid--${column.lane.toLowerCase()}`}
                  >
                    {column.items.map((item) => (
                      <div key={item.title} className="sc-record__point">
                        <h4 className="sc-record__title">
                          <span className="sc-record__num" aria-hidden="true">
                            {item.num}
                          </span>
                          <span>{item.title}</span>
                        </h4>
                        <p className="sc-record__body">
                          {item.body}{' '}
                          {item.sources.map((source) => (
                            <a
                              key={source.href}
                              className="sc-record__source"
                              href={source.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              [{source.label}
                              <SourceArrow />]
                            </a>
                          ))}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <p className="sc-record__close" data-reveal>
              None of these reversed voluntarily. Every reversal followed public
              backlash or a regulator, and most only applied to whichever
              jurisdiction pushed back.
            </p>
          </ShellInner>
        </section>

        <SectionSep />

        <Contact
          numeral={6}
          heading={
            <>
              <mark className="contact__mark">Inspect the architecture,</mark>{' '}
              don&rsquo;t take a policy on trust.
            </>
          }
          description="Walk the zero-egress boundary against the work you already keep inside the network. If a route exists, we will show you. It should not."
          caption="Book a discovery call. We will map Fort Knox onto your environment, and what it takes to keep every answer, log, and citation on your side of the wall."
        />
      </Shell>
    </main>
  )
}
