import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Shell, { ShellInner } from '../components/Shell.jsx'
import SectionSep from '../components/SectionSep.jsx'
import SectionPin from '../components/SectionPin.jsx'
import Contact from '../components/Contact.jsx'
import { SplitCta } from '../components/Button.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import { usePageMeta } from '../lib/usePageMeta.js'
import PipelineFlow from '../components/PipelineFlow.jsx'
import './HowWorksPage.css'

const TITLE = 'How It Works | The Fort Knox Pipeline | OfflineIQ'
const DESCRIPTION =
  'A six-stage pipeline that turns your private document corpus into cited, sourced work, without a single byte leaving your network.'
const KEYWORDS = 'how private AI works, zero-egress AI pipeline'

const ASK =
  'What is the liability cap in the current MSA, and did the 2024 amendment change it?'

const REPLY_PARTS = [
  { text: 'Clause 4.2 caps liability at ', mark: null },
  { text: 'twelve months of fees', mark: 'a' },
  { text: '. The 2024 amendment ', mark: null },
  { text: 'does not modify that cap', mark: 'b' },
  { text: '. Schedule B still points residual liability back to ', mark: null },
  { text: 'Clause 4.2', mark: 'c' },
  { text: '.', mark: null },
]

const REPLY_PLAIN = REPLY_PARTS.map((part) => part.text).join('')

const SOURCES = [
  {
    id: 'msa',
    n: '1',
    mark: 'a',
    short: 'MSA',
    label: 'Agreement',
    title: 'Master Services Agreement',
    meta: 'Corpus · page 11',
    before: '\u2026 liability is capped at ',
    hit: 'twelve months of fees',
    after: ' \u2026',
  },
  {
    id: 'amend',
    n: '2',
    mark: 'b',
    short: 'Amd.',
    label: 'Amendment',
    title: 'Amendment 2024',
    meta: 'Corpus · section 3.1',
    before: '\u2026 this amendment ',
    hit: 'does not modify Clause 4.2',
    after: ' \u2026',
  },
  {
    id: 'sched',
    n: '3',
    mark: 'c',
    short: 'Sch. B',
    label: 'Schedule',
    title: 'Schedule B',
    meta: 'Corpus · page 2',
    before: '\u2026 residual liability is governed by ',
    hit: 'Clause 4.2',
    after: ' of the MSA \u2026',
  },
]

const CHAR_MS = 26
const CONF_STEPS = [71, 84, 92]

function PinTitle({ n, label }) {
  return (
    <SectionPin>
      <h2 className="hw-pin">
        <span className="hw-pin__num" aria-hidden="true">
          {greekNumeral(n)}.
        </span>
        <span className="hw-pin__label">{label}</span>
      </h2>
      <div className="hw-pin__rule" aria-hidden="true" />
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

function useInView(threshold = 0.28) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => setOn(entry.isIntersecting),
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, on]
}

function pointOf(el, origin) {
  const r = el.getBoundingClientRect()
  return {
    x: r.left - origin.left + r.width / 2,
    y: r.top - origin.top + r.height / 2,
  }
}

function Sparkle() {
  return (
    <svg className="hw-cite__spark" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.2 9.05 6.3 14.4 7.2 9.05 8.1 8 13.2 6.95 8.1 1.6 7.2 6.95 6.3Z" />
    </svg>
  )
}

function UserGlyph() {
  return (
    <svg className="hw-cite__user" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8.2" r="3.1" />
      <path d="M5.4 18.6c1.3-3 3.6-4.4 6.6-4.4s5.3 1.4 6.6 4.4" />
    </svg>
  )
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.2" />
      <path d="M5.3 8.15 7.15 10l3.55-4.05" />
    </svg>
  )
}

function BarsGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.2 12V8.2M8 12V4.4M12.8 12V6.6" />
    </svg>
  )
}

function typedLength(parts, count) {
  let left = count
  return parts.map((part) => {
    if (left <= 0) return { ...part, shown: '' }
    const shown = part.text.slice(0, left)
    left -= shown.length
    return { ...part, shown }
  })
}

function sourceLit(mark, phase, stacked) {
  if (phase === 'hold') return true
  if (stacked) {
    if (mark === 'c') return phase === 'src3' || phase === 'src2' || phase === 'src1'
    if (mark === 'b') return phase === 'src2' || phase === 'src1'
    return phase === 'src1'
  }
  if (mark === 'a') return phase === 'src1' || phase === 'src2' || phase === 'src3'
  if (mark === 'b') return phase === 'src2' || phase === 'src3'
  return phase === 'src3'
}

function ReloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.2-5.5" />
      <path d="M20 4.5V8.8h-4.3" />
    </svg>
  )
}

function CiteBoard() {
  const [boardRef, live] = useInView(0.2)
  const askPort = useRef(null)
  const replyIn = useRef(null)
  const replyPorts = useRef([])
  const srcPorts = useRef([])
  const timers = useRef([])
  const [runId, setRunId] = useState(0)
  const [stacked, setStacked] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [ask, setAsk] = useState('')
  const [replyN, setReplyN] = useState(0)
  const [conf, setConf] = useState(0)
  const [askHead, setAskHead] = useState(false)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [wires, setWires] = useState({ ask: '', src: ['', '', ''] })

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
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
    if (!live && runId === 0) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrow = window.matchMedia('(max-width: 1100px)').matches

    if (reduce) {
      setAsk(ASK)
      setReplyN(REPLY_PLAIN.length)
      setConf(92)
      setAskHead(true)
      setPhase('hold')
      return undefined
    }

    let cancelled = false

    const reset = () => {
      setPhase('ask')
      setAsk('')
      setReplyN(0)
      setConf(0)
      setAskHead(false)
    }

    const afterReply = () => {
      if (narrow) {
        setPhase('src3')
        setConf(CONF_STEPS[0])
        later(() => {
          setPhase('src2')
          setConf(CONF_STEPS[1])
          later(() => {
            setPhase('src1')
            setConf(CONF_STEPS[2])
            later(() => setPhase('hold'), 720)
          }, 640)
        }, 640)
        return
      }

      setPhase('src1')
      setConf(CONF_STEPS[0])
      later(() => {
        setPhase('src2')
        setConf(CONF_STEPS[1])
        later(() => {
          setPhase('src3')
          setConf(CONF_STEPS[2])
          later(() => setPhase('hold'), 720)
        }, 640)
      }, 640)
    }

    const run = () => {
      if (cancelled) return
      clearTimers()
      reset()

      let i = 0
      const typeAsk = () => {
        if (cancelled) return
        i += 1
        setAsk(ASK.slice(0, i))
        if (i < ASK.length) later(typeAsk, CHAR_MS)
        else {
          later(() => {
            setPhase('send')
            later(() => setAskHead(true), 560)
            later(() => {
              setPhase('reply')
              let r = 0
              const typeReply = () => {
                if (cancelled) return
                r += 1
                setReplyN(r)
                if (r < REPLY_PLAIN.length) later(typeReply, 17)
                else afterReply()
              }
              typeReply()
            }, 620)
          }, 320)
        }
      }
      typeAsk()
    }

    later(run, runId === 0 ? 360 : 80)
    return () => {
      cancelled = true
      clearTimers()
    }
  }, [live, runId])

  useLayoutEffect(() => {
    const board = boardRef.current
    if (!board) return undefined

    const paint = () => {
      const origin = board.getBoundingClientRect()
      if (origin.width < 8) return
      setBox((prev) =>
        prev.w === origin.width && prev.h === origin.height
          ? prev
          : { w: origin.width, h: origin.height },
      )

      const fromAsk = askPort.current ? pointOf(askPort.current, origin) : null
      const toReply = replyIn.current ? pointOf(replyIn.current, origin) : null
      let askPath = ''
      if (fromAsk && toReply) {
        if (stacked) {
          askPath = `M ${fromAsk.x.toFixed(1)} ${fromAsk.y.toFixed(1)} L ${toReply.x.toFixed(1)} ${fromAsk.y.toFixed(1)} L ${toReply.x.toFixed(1)} ${toReply.y.toFixed(1)}`
        } else {
          askPath = `M ${fromAsk.x.toFixed(1)} ${fromAsk.y.toFixed(1)} L ${toReply.x.toFixed(1)} ${toReply.y.toFixed(1)}`
        }
      }

      const src = SOURCES.map((_, i) => {
        const fromEl = replyPorts.current[i]
        const toEl = srcPorts.current[i]
        if (!fromEl || !toEl) return ''
        const from = pointOf(fromEl, origin)
        const to = pointOf(toEl, origin)
        if (stacked) {
          const rail = Math.max(12, Math.min(from.x, to.x) - (14 + (2 - i) * 12))
          return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} L ${rail.toFixed(1)} ${from.y.toFixed(1)} L ${rail.toFixed(1)} ${to.y.toFixed(1)} L ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
        }
        const midX = from.x + (to.x - from.x) * 0.46
        return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} L ${midX.toFixed(1)} ${from.y.toFixed(1)} L ${midX.toFixed(1)} ${to.y.toFixed(1)} L ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
      })

      setWires((prev) => {
        if (
          prev.ask === askPath &&
          prev.src[0] === src[0] &&
          prev.src[1] === src[1] &&
          prev.src[2] === src[2]
        ) {
          return prev
        }
        return { ask: askPath, src }
      })
    }

    paint()
    const frame = window.requestAnimationFrame(paint)
    const ro = new ResizeObserver(paint)
    ro.observe(board)
    window.addEventListener('resize', paint)
    return () => {
      window.cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', paint)
    }
  }, [boardRef, phase, ask, replyN, stacked])

  const srcOn = {
    a: sourceLit('a', phase, stacked),
    b: sourceLit('b', phase, stacked),
    c: sourceLit('c', phase, stacked),
  }
  const replyParts = typedLength(REPLY_PARTS, replyN)
  const showReply = phase === 'reply' || phase === 'src1' || phase === 'src2' || phase === 'src3' || phase === 'hold'
  const showAskWire = phase === 'send' || showReply

  return (
    <section
      className={`hw-cite is-${phase}${stacked ? ' is-stack' : ''}`}
      ref={boardRef}
      aria-label="Every answer shows its work"
    >
      <span className="hw-cite__tick hw-cite__tick--tl" aria-hidden="true" />
      <span className="hw-cite__tick hw-cite__tick--tr" aria-hidden="true" />
      <span className="hw-cite__tick hw-cite__tick--bl" aria-hidden="true" />
      <span className="hw-cite__tick hw-cite__tick--br" aria-hidden="true" />

      <p className="hw-cite__brand">OfflineIQ</p>
      <p className="hw-cite__brand hw-cite__brand--right">Private AI. Real work.</p>

      <svg
        className="hw-cite__wires"
        viewBox={box.w && box.h ? `0 0 ${box.w} ${box.h}` : '0 0 100 100'}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="hw-ask-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M1.2 1.2 6.8 4 1.2 6.8" />
          </marker>
        </defs>
        {wires.ask ? (
          <path
            className={`hw-cite__wire hw-cite__wire--ask${showAskWire ? ' is-on' : ''}`}
            d={wires.ask}
            pathLength="1"
            markerEnd={askHead ? 'url(#hw-ask-arrow)' : undefined}
          />
        ) : null}
        {wires.src.map((d, i) =>
          d ? (
            <path
              key={SOURCES[i].id}
              className={`hw-cite__wire hw-cite__wire--${SOURCES[i].mark}${srcOn[SOURCES[i].mark] ? ' is-on' : ''}`}
              d={d}
              pathLength="1"
            />
          ) : null,
        )}
      </svg>

      <div className="hw-cite__grid">
        <div className="hw-cite__copy">
          <p className="hw-cite__kicker">Trusted answers</p>
          <h2 className="hw-cite__title">
            Every Answer
            <br />
            Shows Its Work.
          </h2>
          <p className="hw-cite__lede">
            OfflineIQ doesn&rsquo;t just give you answers — it cites the exact
            sources and shows you the reasoning, so you can trust, verify, and go
            deeper.
          </p>
        </div>

        <div className="hw-cite__stage">
          <div className="hw-cite__ask-col">
            <article className="hw-cite__card hw-cite__card--ask">
              <header>
                <UserGlyph />
                <span>Your question</span>
                <time>10:24 AM</time>
              </header>
              <p>
                {ask}
                {phase === 'ask' ? <b className="hw-cite__caret" /> : null}
              </p>
              <i className="hw-cite__port hw-cite__port--ask" ref={askPort} />
            </article>
            <p className="hw-cite__hint">
              Ask in natural language
              <br />
              on your own hardware
            </p>
          </div>

          <div className="hw-cite__reply-col">
            <article
              className={`hw-cite__card hw-cite__card--reply${showReply ? ' is-on' : ''}`}
            >
              <header>
                <Sparkle />
                <span>OfflineIQ</span>
                <time>10:24 AM</time>
              </header>
              <p>
                {replyParts.map((part, i) =>
                  part.mark ? (
                    <mark
                      key={i}
                      className={`hw-cite__hl hw-cite__hl--${part.mark}${srcOn[part.mark] ? ' is-lit' : ''}`}
                    >
                      {part.shown}
                    </mark>
                  ) : (
                    <span key={i}>{part.shown}</span>
                  ),
                )}
                {phase === 'reply' ? <b className="hw-cite__caret" /> : null}
              </p>
              <footer>
                <span>
                  <CheckGlyph />
                  Answer grounded in 3 sources
                </span>
                <span>
                  <BarsGlyph />
                  {conf ? `${conf}%` : '—'} confidence
                </span>
              </footer>
              <i
                className={`hw-cite__port hw-cite__port--in${askHead ? ' is-on' : ''}`}
                ref={replyIn}
              />
              {SOURCES.map((item, i) => (
                <i
                  key={item.id}
                  className={`hw-cite__port hw-cite__port--${item.mark}${srcOn[item.mark] ? ' is-on' : ''}`}
                  ref={(el) => {
                    replyPorts.current[i] = el
                  }}
                />
              ))}
            </article>
            <p className="hw-cite__foot">Cited. Verifiable. Yours.</p>
          </div>
        </div>

        <div className="hw-cite__sources">
          <p className="hw-cite__kicker hw-cite__kicker--src">Sources</p>
          <ol>
            {SOURCES.map((item, i) => (
              <li
                key={item.id}
                className={`hw-cite__src hw-cite__src--${item.mark}${srcOn[item.mark] ? ' is-on' : ''}`}
              >
                <i
                  className="hw-cite__src-port"
                  ref={(el) => {
                    srcPorts.current[i] = el
                  }}
                />
                <div className="hw-cite__src-brand" aria-hidden="true">
                  <span>{item.short}</span>
                  <small>{item.label}</small>
                </div>
                <div className="hw-cite__src-body">
                  <p className="hw-cite__src-head">
                    <b>{item.n}</b>
                    {item.title}
                  </p>
                  <p className="hw-cite__src-meta">{item.meta}</p>
                  <p className="hw-cite__src-quote">
                    <span aria-hidden="true">&ldquo;</span>
                    {item.before}
                    <mark>{item.hit}</mark>
                    {item.after}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {phase === 'hold' ? (
        <button
          type="button"
          className="hw-cite__reload"
          aria-label="Replay the citation"
          onClick={() => {
            clearTimers()
            setAskHead(false)
            setPhase('idle')
            setAsk('')
            setReplyN(0)
            setConf(0)
            setRunId((n) => n + 1)
          }}
        >
          <ReloadIcon />
        </button>
      ) : null}
      <p className="hw-cite__rail">Your data. Your AI. Your intelligence.</p>
      <p className="hw-cite__rail hw-cite__rail--right">Built for what matters.</p>
    </section>
  )
}

function Environment() {
  return (
    <div className="hw-env">
      <article className="hw-env__card">
        <p className="hw-env__kicker">Primary path</p>
        <h3>Fort Knox</h3>
        <p>
          Sealed hardware, plugged into your network, live within the hour. The
          corpus never leaves the chassis.
        </p>
        <figure>
          <img src="/fortknox-closed.png" alt="Fort Knox sealed appliance" />
          <figcaption>Your LAN · no WAN path · live within the hour</figcaption>
        </figure>
      </article>
      <article className="hw-env__card">
        <p className="hw-env__kicker">Same architecture</p>
        <h3>Client-owned AWS VPC</h3>
        <p>
          For teams not ready for physical hardware: a private subnet, no
          internet gateway. The pipeline is the same. The boundary is yours.
        </p>
        <div className="hw-vpc" aria-hidden="true">
          <p className="hw-vpc__acct">Your AWS account</p>
          <div className="hw-vpc__sub">
            <span>Private subnet</span>
            <b>Fort Knox stack</b>
            <small>No public IP</small>
          </div>
          <p className="hw-vpc__cut">
            <i />
            No internet gateway
          </p>
        </div>
      </article>
      <p className="hw-env__close">Either way: pilot in days, not months.</p>
    </div>
  )
}

const DASH_NAV = [
  { id: 'security', label: 'Security' },
  { id: 'usage', label: 'Usage' },
  { id: 'documents', label: 'Documents' },
  { id: 'agents', label: 'Agents' },
  { id: 'audit', label: 'Audit trail' },
  { id: 'settings', label: 'Settings' },
]

const DASH_POINTS = [
  {
    id: 'air',
    title: 'Air-gapped by design',
    body: 'Runs entirely within your network.',
  },
  {
    id: 'audit',
    title: 'Audit ready',
    body: 'Local logs, traceable answers, compliance made simple.',
  },
  {
    id: 'ent',
    title: 'Built for enterprise',
    body: 'Your data. Your policies. Your control.',
  },
]

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function pad2(n) {
  return String(n).padStart(2, '0')
}

function formatStamp(date) {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
}

function DashIco({ name }) {
  return (
    <svg className="hw-dash__ico" viewBox="0 0 24 24" aria-hidden="true">
      {name === 'lock' ? (
        <>
          <rect x="6" y="11" width="12" height="9" rx="1.5" />
          <path d="M8.5 11V8.2a3.5 3.5 0 0 1 7 0V11" />
        </>
      ) : null}
      {name === 'doc' ? (
        <>
          <path d="M7 4.5h7.2L18.5 9v10.5H7z" />
          <path d="M14.2 4.5V9H18.5" />
          <path d="M9.4 13h5.4M9.4 16h5.4" />
        </>
      ) : null}
      {name === 'users' ? (
        <>
          <circle cx="9" cy="8.2" r="2.6" />
          <path d="M4.4 17.6c.9-2.6 2.7-3.8 4.6-3.8s3.7 1.2 4.6 3.8" />
          <circle cx="16.2" cy="9" r="2.1" />
          <path d="M15.1 13.8c1.7.2 3.1 1.2 3.8 3.8" />
        </>
      ) : null}
      {name === 'shield' ? (
        <path d="M12 3.6 18.4 6v5.2c0 4.1-2.7 7.2-6.4 8.6C8.3 18.4 5.6 15.3 5.6 11.2V6z" />
      ) : null}
      {name === 'link' ? (
        <path d="M9.6 14.4 14.4 9.6M10.4 9.2l.8-0.8a3.1 3.1 0 0 1 4.4 4.4l-.8.8M13.6 14.8l-.8.8a3.1 3.1 0 0 1-4.4-4.4l.8-.8" />
      ) : null}
      {name === 'globe' ? (
        <>
          <circle cx="12" cy="12" r="7.2" />
          <path d="M4.8 12h14.4M12 4.8c2.2 2.2 3.3 4.6 3.3 7.2S14.2 17 12 19.2C9.8 17 8.7 14.6 8.7 12S9.8 7 12 4.8z" />
        </>
      ) : null}
      {name === 'bars' ? <path d="M5 16V10M12 16V6M19 16v-4" /> : null}
      {name === 'server' ? (
        <>
          <rect x="5" y="4.5" width="14" height="5.2" rx="1.2" />
          <rect x="5" y="14.3" width="14" height="5.2" rx="1.2" />
          <path d="M8 7.1h.01M8 16.9h.01" />
        </>
      ) : null}
      {name === 'stack' ? (
        <>
          <path d="M5 9.2 12 6l7 3.2-7 3.2z" />
          <path d="M5 12.6 12 15.8 19 12.6" />
          <path d="M5 16 12 19.2 19 16" />
        </>
      ) : null}
      {name === 'pulse' ? (
        <path d="M3.6 12h3.2l2.1-4.4 3.4 9.2L14.8 12h5.6" />
      ) : null}
      {name === 'check' ? (
        <>
          <circle cx="12" cy="12" r="7.2" />
          <path d="M8.4 12.2 10.8 14.6 15.6 9.6" />
        </>
      ) : null}
      {name === 'usage' ? <path d="M4.5 17.5 9 11l3.2 3.8L19.5 6.5" /> : null}
      {name === 'agents' ? (
        <>
          <rect x="5" y="8" width="5.2" height="8" rx="1" />
          <rect x="13.8" y="5.5" width="5.2" height="10.5" rx="1" />
        </>
      ) : null}
      {name === 'gear' ? (
        <>
          <circle cx="12" cy="12" r="2.4" />
          <path d="M12 5.2V3.6M12 20.4v-1.6M18.8 12h1.6M3.6 12h1.6M16.8 7.2l1.1-1.1M6.1 17.9l1.1-1.1M16.8 16.8l1.1 1.1M6.1 6.1l1.1 1.1" />
        </>
      ) : null}
    </svg>
  )
}

function Monitor() {
  const [ref, on] = useInView(0.22)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    if (!on) return undefined
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [on])

  return (
    <div className={`hw-dash${on ? ' is-live' : ''}`} ref={ref}>
      <div className="hw-dash__copy">
        <p className="hw-dash__kicker">Security &amp; compliance</p>
        <h4 className="hw-dash__title">No egress detected.</h4>
        <p className="hw-dash__lede">
          Your AI stays inside your environment. No external calls, no data
          leakage, no risk.
        </p>
        <ul className="hw-dash__points">
          {DASH_POINTS.map((item) => (
            <li key={item.id}>
              <span>
                <DashIco
                  name={item.id === 'air' ? 'lock' : item.id === 'audit' ? 'doc' : 'users'}
                />
              </span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <SplitCta size="lg" />
      </div>

      <article className="hw-dash__panel" aria-label="Private boundary dashboard">
        <aside className="hw-dash__nav" aria-hidden="true">
          {DASH_NAV.map((item) => (
            <span
              key={item.id}
              className={item.id === 'security' ? 'is-on' : undefined}
            >
              <DashIco
                name={
                  item.id === 'security'
                    ? 'shield'
                    : item.id === 'usage'
                      ? 'usage'
                      : item.id === 'documents'
                        ? 'doc'
                        : item.id === 'agents'
                          ? 'agents'
                          : item.id === 'audit'
                            ? 'bars'
                            : 'gear'
                }
              />
              {item.label}
            </span>
          ))}
        </aside>

        <div className="hw-dash__main">
          <header className="hw-dash__head">
            <div>
              <p className="hw-dash__brand">OfflineIQ</p>
              <h4>Security &amp; compliance</h4>
              <p>Real-time view of your private AI environment.</p>
            </div>
            <p className="hw-dash__live">
              <i />
              All systems secure
              <time dateTime={now.toISOString()}>{formatStamp(now)}</time>
            </p>
          </header>

          <ul className="hw-dash__kpis">
            <li>
              <DashIco name="shield" />
              <strong>Private boundary verified</strong>
              <p>No external network access</p>
              <b>Secure</b>
            </li>
            <li>
              <DashIco name="link" />
              <strong>Outbound routes</strong>
              <p>0 configured</p>
              <b>Blocked</b>
            </li>
            <li>
              <DashIco name="globe" />
              <strong>External calls</strong>
              <p>0 attempts</p>
              <b>None detected</b>
            </li>
            <li>
              <DashIco name="doc" />
              <strong>Local audit trail healthy</strong>
              <p>AI activity logged locally</p>
              <b>Operational</b>
            </li>
          </ul>

          <div className="hw-dash__bound">
            <p className="hw-dash__bound-label">Network boundary</p>
            <div className="hw-dash__flow" aria-hidden="true">
              <div className="hw-dash__node">
                <DashIco name="server" />
                <strong>Your data</strong>
                <small>Internal network</small>
              </div>
              <span className="hw-dash__line" />
              <div className="hw-dash__node">
                <DashIco name="stack" />
                <strong>OfflineIQ</strong>
                <small>AI workspace</small>
              </div>
              <span className="hw-dash__line hw-dash__line--cut">
                <em>No egress detected</em>
              </span>
              <div className="hw-dash__node hw-dash__node--off">
                <DashIco name="globe" />
                <strong>Internet</strong>
                <small>Blocked</small>
              </div>
            </div>
            <div className="hw-dash__up">
              <DashIco name="pulse" />
              <div>
                <strong>99.99%</strong>
                <p>System uptime</p>
              </div>
              <b>Operational</b>
            </div>
          </div>

          <ul className="hw-dash__facts">
            <li>
              <DashIco name="server" />
              <strong>Internal storage only</strong>
              <p>All data remains on your infrastructure</p>
              <b>Verified</b>
            </li>
            <li>
              <DashIco name="doc" />
              <strong>Citations active</strong>
              <p>Every answer linked to your sources</p>
              <b>Enabled</b>
            </li>
            <li>
              <DashIco name="shield" />
              <strong>Compliance ready</strong>
              <p>Supports SOC 2, HIPAA, and more</p>
              <b>Ready</b>
            </li>
          </ul>

          <footer className="hw-dash__foot">
            <span>
              <DashIco name="check" />
              No external connections. No data leaves your environment.
            </span>
            <small>Your data stays yours</small>
          </footer>
        </div>
      </article>
    </div>
  )
}

function HowWorksPage() {
  const revealRef = useReveal()

  usePageMeta({
    title: TITLE,
    description: DESCRIPTION,
    keywords: KEYWORDS,
    image: '/fortknox-closed.png',
    path: '/how-it-works',
  })

  return (
    <main className="hw" ref={revealRef}>
      <CiteBoard />

      <Shell>
        <SectionSep />

        <section className="hw-section" id="pipeline">
          <ShellInner>
            <PinTitle n={1} label="The Pipeline" />
            <div className="hw-intro" data-reveal>
              <h1 className="hw-heading">
                A <mark className="hw-heading__mark">six-stage pipeline</mark>, not
                a chat window
              </h1>
              <p className="hw-caption">
                Connect, index, retrieve, generate, cite, verify. The work is
                produced inside your network. Nothing in that chain calls the
                internet to finish a job.
              </p>
            </div>
            <div data-reveal>
              <PipelineFlow />
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="hw-section" id="environment">
          <ShellInner>
            <PinTitle n={2} label="Runs in your environment, not ours" />
            <div className="hw-intro" data-reveal>
              <h3 className="hw-heading hw-heading--sub">
                Fort Knox is the primary path. The same architecture can sit in
                a VPC you own.
              </h3>
              <p className="hw-caption">
                Sealed hardware, plugged into your network, live within the
                hour. Or a client-owned AWS VPC: private subnet, no internet
                gateway. Either way: pilot in days, not months.
              </p>
            </div>
            <div data-reveal>
              <Environment />
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="hw-section hw-section--last" id="check">
          <ShellInner>
            <PinTitle n={3} label={"Don't take our word for it"} />
            <div className="hw-intro" data-reveal>
              <h3 className="hw-heading hw-heading--sub">
                A live dashboard confirms the private boundary and reports{' '}
                <mark className="hw-heading__mark">no egress</mark> detected.
              </h3>
            </div>
            <div data-reveal>
              <Monitor />
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <Contact
          numeral={4}
          heading={
            <>
              A pipeline you can{' '}
              <mark className="contact__mark">inspect</mark>, not a chat window
              you have to trust.
            </>
          }
          description="Walk the six stages against your own corpus. If the citations do not hold, the work does not ship."
          caption="Book a discovery call. We will map the pipeline onto the documents you already keep, and what it takes to run it inside your network."
        />
      </Shell>
    </main>
  )
}

export default HowWorksPage
