import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SplitCta } from './Button.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import './WhyItMatters.css'

const ASK = 'Summarize our Q3 financials\u2026'
const CHAR_MS = 36

const BILL = {
  employees: 250,
  queries: 50,
  monthly: 4500,
}

const STEPS = [
  {
    id: 'ask',
    num: '01',
    title: 'You ask a question.',
    body: 'You type a query into a cloud AI tool.',
    blurb: 'A private question, typed like it never leaves the room.',
  },
  {
    id: 'leave',
    num: '02',
    title: 'It leaves your building.',
    body: 'Your data travels across the internet to a server you don\u2019t control.',
    blurb: 'Your query, files and context are packed and sent over the internet.',
  },
  {
    id: 'cloud',
    num: '03',
    title: 'It gets processed by their systems.',
    body: 'Your data is handled, logged and may be stored \u2014 alongside millions of others.',
    blurb: 'It reaches a server owned by a big tech company.',
  },
  {
    id: 'asset',
    num: '04',
    title: 'It becomes their asset.',
    body: 'Your data may be used for training, fine-tuning and product development \u2014 without your explicit control.',
    blurb: 'Your data can be used to train and improve their models.',
  },
  {
    id: 'risks',
    num: '05',
    title: 'The real risks.',
    body: 'You risk losing control, exposing sensitive information, and giving away your competitive edge.',
    blurb: 'It can resurface in unexpected ways.',
  },
  {
    id: 'bill',
    num: '06',
    title: 'You pay for it.',
    body: 'Your data fuels their growth. And you get billed back by the token.',
    blurb: 'And in the end\u2026 you get the bill.',
  },
]

const VENDORS = [
  { id: 'openai', name: 'OpenAI', src: '/why-it-matters/openai.svg' },
  { id: 'google', name: 'Google', src: '/why-it-matters/google.svg' },
  { id: 'anthropic', name: 'Anthropic', src: '/why-it-matters/anthropic.svg' },
  { id: 'meta', name: 'Meta', src: '/why-it-matters/meta.svg' },
]

const ASSETS = [
  { id: 'q', ico: 'chat', label: 'Your questions' },
  { id: 'd', ico: 'file', label: 'Your documents' },
  { id: 'c', ico: 'code', label: 'Your code' },
  { id: 'b', ico: 'bars', label: 'Your business data' },
]

const RISKS = [
  { ico: 'light', text: 'Your ideas could inspire competitors.' },
  { ico: 'code', text: 'Your code could appear in model outputs.' },
  { ico: 'clock', text: 'Your confidential data may be retained longer than you expect.' },
  { ico: 'users', text: 'Your information could be seen by human reviewers.' },
]

const VALUES = [
  { ico: 'lock', label: 'Keep control of your data' },
  { ico: 'ban', label: 'Protect your intellectual property' },
  { ico: 'shield', label: 'Stay compliant and secure' },
  { ico: 'users', label: 'Build AI on your terms' },
]

const PHASES = [
  'idle',
  'ask',
  'send',
  'leave',
  'cloud',
  'asset',
  'risks',
  'bill',
  'hold',
]

const STEP_PHASE = {
  ask: 'ask',
  leave: 'leave',
  cloud: 'cloud',
  asset: 'asset',
  risks: 'risks',
  bill: 'bill',
}

const EMPTY_HOPS = [
  { d: '', len: 0 },
  { d: '', len: 0 },
  { d: '', len: 0 },
  { d: '', len: 0 },
]

const EMPTY_WIRES = {
  send: { d: '', len: 0 },
  pack: { d: '', len: 0 },
  feeds: EMPTY_HOPS.map((hop) => ({ ...hop })),
  fans: EMPTY_HOPS.map((hop) => ({ ...hop })),
  tails: EMPTY_HOPS.map((hop) => ({ ...hop })),
}

function phaseIndex(phase) {
  const i = PHASES.indexOf(phase)
  return i < 0 ? 0 : i
}

function stepOn(phase, id) {
  return phaseIndex(phase) >= phaseIndex(STEP_PHASE[id])
}

function pointOf(el, origin) {
  const r = el.getBoundingClientRect()
  return {
    x: r.left - origin.left + r.width / 2,
    y: r.top - origin.top + r.height / 2,
  }
}

function curve(from, to, stacked, spread = 0) {
  if (stacked) {
    const rail = Math.max(10, Math.min(from.x, to.x) - 18)
    return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} C ${rail.toFixed(1)} ${(from.y + spread).toFixed(1)}, ${rail.toFixed(1)} ${to.y.toFixed(1)}, ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
  }
  const dx = to.x - from.x
  const c1x = from.x + dx * 0.34
  const c2x = from.x + dx * 0.66
  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} C ${c1x.toFixed(1)} ${(from.y + spread).toFixed(1)}, ${c2x.toFixed(1)} ${to.y.toFixed(1)}, ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
}

function pathLen(d) {
  if (!d) return 0
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  try {
    return path.getTotalLength()
  } catch {
    return 180
  }
}

function wireOf(from, to, stacked, spread = 0) {
  if (!from || !to) return { d: '', len: 0 }
  const d = curve(from, to, stacked, spread)
  return { d, len: pathLen(d) }
}

function sameWire(a, b) {
  return a.d === b.d && a.len === b.len
}

function ReloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.2-5.5" />
      <path d="M20 4.5V8.8h-4.3" />
    </svg>
  )
}

function Ico({ name }) {
  if (name === 'file') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3.5h7.2L19 8.2V20.5H7z" />
        <path d="M14.2 3.5V8.2H19" />
      </svg>
    )
  }
  if (name === 'chat') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6.5h14v9.5H9.5L5 20z" />
      </svg>
    )
  }
  if (name === 'code') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.5 8 4.5 12l4 4M15.5 8l4 4-4 4" />
      </svg>
    )
  }
  if (name === 'bars') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 17V11M12 17V7M18 17v-4" />
      </svg>
    )
  }
  if (name === 'brain') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      </svg>
    )
  }
  if (name === 'users') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="9" r="2.4" />
        <path d="M5.2 16.5c.8-2 2.4-3 3.8-3s3 1 3.8 3" />
        <circle cx="16" cy="9.2" r="2" />
        <path d="M15.2 16.5c.4-1.2 1.4-2.1 2.6-2.1 1 0 1.8.6 2.3 1.6" />
      </svg>
    )
  }
  if (name === 'lock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="10.5" width="12" height="9" rx="1.2" />
        <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
      </svg>
    )
  }
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5 19 6.5v5.2c0 4.1-2.9 7.6-7 8.8-4.1-1.2-7-4.7-7-8.8V6.5z" />
        <path d="M9 12.2 11 14.2 15.2 9.8" />
      </svg>
    )
  }
  if (name === 'ban') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" />
        <path d="M7 7.2 17 16.8" />
      </svg>
    )
  }
  if (name === 'light') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.2 13.6a4.8 4.8 0 1 1 5.6 0L14.2 16h-4.4z" />
        <path d="M10 16.5h4V18H10zM10.6 19h2.8" />
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" />
        <path d="M12 8.2V12l3 2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="5" width="12" height="15" rx="1.2" />
      <path d="M9 10.5h6M9 14h4" />
    </svg>
  )
}

function useInView(threshold = 0.22) {
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

function useCount(on, to, ms) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!on) {
      setN(0)
      return undefined
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setN(to)
      return undefined
    }

    const start = performance.now()
    let raf = 0
    const tick = (now) => {
      const p = Math.min(1, (now - start) / ms)
      setN(Math.round(to * (1 - (1 - p) ** 3)))
      if (p < 1) raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [on, to, ms])

  return n
}

function Tick({ pos }) {
  return <span className={`matters__tick matters__tick--${pos}`} aria-hidden="true" />
}

function Wire({ hop, on }) {
  if (!hop.d) return null
  return (
    <path
      className={`matters__wire${on ? ' is-on' : ''}`}
      d={hop.d}
      style={{
        '--wire-len': String(hop.len || 240),
        strokeDasharray: '5 6',
        strokeDashoffset: on ? undefined : hop.len || 240,
      }}
    />
  )
}

function WhyItMatters() {
  const [boardRef, live] = useInView(0.18)
  const sendRef = useRef(null)
  const packetRef = useRef(null)
  const serverRef = useRef(null)
  const assetInRefs = useRef([])
  const assetOutRefs = useRef([])
  const brainRef = useRef(null)
  const brainOutRef = useRef(null)
  const riskInRefs = useRef([])
  const timers = useRef([])
  const [runId, setRunId] = useState(0)
  const [stacked, setStacked] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [ask, setAsk] = useState('')
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [wires, setWires] = useState(EMPTY_WIRES)

  const billing = phase === 'bill' || phase === 'hold'
  const peopleN = useCount(billing, BILL.employees, 900)
  const queryN = useCount(billing, BILL.queries, 900)
  const monthN = useCount(billing, BILL.monthly, 1400)

  const sendOn = phase === 'send' || stepOn(phase, 'leave')

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
    if (reduce) {
      setAsk(ASK)
      setPhase('hold')
      return undefined
    }

    let cancelled = false

    const play = () => {
      if (cancelled) return
      clearTimers()
      setPhase('idle')
      setAsk('')

      later(() => {
        setPhase('ask')
        let i = 0
        const typeAsk = () => {
          if (cancelled) return
          i += 1
          setAsk(ASK.slice(0, i))
          if (i < ASK.length) later(typeAsk, CHAR_MS)
          else {
            later(() => setPhase('send'), 560)
            later(() => setPhase('leave'), 1400)
            later(() => setPhase('cloud'), 2500)
            later(() => setPhase('asset'), 4000)
            later(() => setPhase('risks'), 5800)
            later(() => setPhase('bill'), 7400)
            later(() => setPhase('hold'), 9600)
          }
        }
        typeAsk()
      }, runId === 0 ? 400 : 120)
    }

    play()
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

      const send = sendRef.current ? pointOf(sendRef.current, origin) : null
      const packet = packetRef.current ? pointOf(packetRef.current, origin) : null
      const server = serverRef.current ? pointOf(serverRef.current, origin) : null
      const brain = brainRef.current ? pointOf(brainRef.current, origin) : null
      const brainOut = brainOutRef.current
        ? pointOf(brainOutRef.current, origin)
        : brain
      const feeds = ASSETS.map((_, i) => {
        const el = assetInRefs.current[i]
        if (!el || !server) return { d: '', len: 0 }
        return wireOf(server, pointOf(el, origin), stacked, (i - 1.5) * 16)
      })
      const fans = ASSETS.map((_, i) => {
        const el = assetOutRefs.current[i]
        if (!el || !brain) return { d: '', len: 0 }
        return wireOf(pointOf(el, origin), brain, stacked, (i - 1.5) * 10)
      })
      const tails = RISKS.map((_, i) => {
        const el = riskInRefs.current[i]
        if (!el || !brainOut) return { d: '', len: 0 }
        return wireOf(brainOut, pointOf(el, origin), stacked, (i - 1.5) * 12)
      })

      const next = {
        send: wireOf(send, packet, stacked),
        pack: wireOf(packet, server, stacked),
        feeds,
        fans,
        tails,
      }

      setWires((prev) => {
        if (
          sameWire(prev.send, next.send) &&
          sameWire(prev.pack, next.pack) &&
          prev.feeds.every((hop, i) => sameWire(hop, next.feeds[i])) &&
          prev.fans.every((hop, i) => sameWire(hop, next.fans[i])) &&
          prev.tails?.every((hop, i) => sameWire(hop, next.tails[i]))
        ) {
          return prev
        }
        return next
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
  }, [boardRef, phase, stacked, ask])

  return (
    <section className="matters" id="why-it-matters">
      <div className="matters__pin">
        <h2 className="matters__title">
          <span className="matters__num" aria-hidden="true">
            {greekNumeral(1)}.
          </span>
          <span className="matters__label">Why it matters</span>
        </h2>
      </div>

      <div className="matters__head">
        <p className="matters__kicker">The hidden cost of convenience</p>
        <h3 className="matters__heading">
          The risk isn&rsquo;t using AI.{' '}
          <mark className="matters__mark">It&rsquo;s where your data goes</mark>
        </h3>
        <p className="matters__caption">
          Every query you send to a cloud AI vendor leaves your building and
          can be stored, analysed, and used in ways you don&rsquo;t control.
        </p>
      </div>

      <div
        className={`matters__board is-${phase}${stacked ? ' is-stack' : ''}`}
        ref={boardRef}
        aria-label="How a cloud query leaves your building"
      >
        <Tick pos="tl" />
        <Tick pos="tr" />
        <Tick pos="bl" />
        <Tick pos="br" />

        <p className="matters__rail">On-prem / Private / Full control</p>
        <p className="matters__rail matters__rail--right">
          Intelligence belongs closer to you
        </p>

        <svg
          className="matters__wires"
          viewBox={box.w && box.h ? `0 0 ${box.w} ${box.h}` : '0 0 100 100'}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <Wire hop={wires.send} on={sendOn} />
          <Wire hop={wires.pack} on={stepOn(phase, 'leave')} />
          {wires.feeds.map((hop, i) => (
            <Wire
              key={`feed-${ASSETS[i].id}`}
              hop={hop}
              on={stepOn(phase, 'cloud')}
            />
          ))}
          {wires.fans.map((hop, i) => (
            <Wire
              key={`fan-${ASSETS[i].id}`}
              hop={hop}
              on={stepOn(phase, 'asset')}
            />
          ))}
          {wires.tails?.map((hop, i) => (
            <Wire
              key={`tail-${i}`}
              hop={hop}
              on={stepOn(phase, 'risks')}
            />
          ))}
        </svg>

        <ol className="matters__steps">
          {STEPS.map((step, i) => (
            <li
              key={step.id}
              className={`matters__step matters__step--${step.id}${
                stepOn(phase, step.id) ||
                (step.id === 'cloud' && stepOn(phase, 'leave')) ||
                (step.id === 'asset' && stepOn(phase, 'cloud')) ||
                phase === 'hold' ? ' is-on' : ''
              }${phase === 'idle' && i === 0 ? ' is-on' : ''}`}
            >
              <div className="matters__visual">
                <div className="matters__stage">
                  {step.id === 'ask' ? (
                    <div className="matters__office">
                      <img
                        className="matters__bg"
                        src="/why-it-matters/step1-bg.png"
                        alt=""
                      />
                      <img
                        className="matters__person"
                        src="/why-it-matters/step1-person.png"
                        alt=""
                      />
                      <div className="matters__bubble">
                        <p>
                          {ask || (phase === 'idle' ? '' : ASK)}
                          {phase === 'ask' ? (
                            <b className="matters__caret" />
                          ) : null}
                        </p>
                        <span
                          className={`matters__send${sendOn ? ' is-on' : ''}`}
                          ref={sendRef}
                        >
                          →
                        </span>
                      </div>
                    </div>
                  ) : null}

                  {step.id === 'leave' ? (
                    <div className="matters__pack">
                      <span className="matters__file matters__file--ghost">
                        Q3.xlsx
                      </span>
                      <span className="matters__file matters__file--ghost">
                        notes.docx
                      </span>
                      <span
                        className={`matters__doc${sendOn ? ' is-on' : ''}`}
                        ref={packetRef}
                      >
                        <span className="matters__doc-title" />
                        <span className="matters__doc-line" />
                        <span className="matters__doc-line" />
                        <span className="matters__doc-line" />
                        <span className="matters__doc-line matters__doc-line--short" />
                      </span>
                    </div>
                  ) : null}

                  {step.id === 'cloud' ? (
                    <div className="matters__cloud">
                      <img
                        className="matters__servers"
                        src="/why-it-matters/step3-cloud.png"
                        alt=""
                      />
                      <ul className="matters__logos">
                        {VENDORS.map((vendor) => (
                          <li
                            key={vendor.id}
                            className={`matters__logo matters__logo--${vendor.id}`}
                          >
                            <img src={vendor.src} alt={vendor.name} />
                          </li>
                        ))}
                      </ul>
                      <i
                        className={`matters__rack${
                          stepOn(phase, 'leave') ? ' is-on' : ''
                        }`}
                        ref={serverRef}
                      />
                    </div>
                  ) : null}

                  {step.id === 'asset' ? (
                    <div className="matters__train">
                      <ul>
                        {ASSETS.map((item, idx) => (
                          <li key={item.id}>
                            <i
                              className="matters__join matters__join--in"
                              ref={(el) => {
                                assetInRefs.current[idx] = el
                              }}
                            />
                            <Ico name={item.ico} />
                            {item.label}
                            <i
                              className="matters__join matters__join--out"
                              ref={(el) => {
                                assetOutRefs.current[idx] = el
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                      <div
                        className={`matters__brain${
                          stepOn(phase, 'cloud') ? ' is-on' : ''
                        }`}
                      >
                        <span className="matters__brain-ico">
                          <i className="matters__join matters__join--brain" ref={brainRef} />
                          <Ico name="brain" />
                          <i className="matters__join matters__join--brain-out" ref={brainOutRef} />
                        </span>
                        <span>Used for training their models</span>
                      </div>
                    </div>
                  ) : null}

                  {step.id === 'risks' ? (
                    <ul className="matters__risks">
                      {RISKS.map((item, idx) => (
                        <li key={item.text}>
                          <i
                            className="matters__join matters__join--in"
                            ref={(el) => {
                              riskInRefs.current[idx] = el
                            }}
                          />
                          <Ico name={item.ico} />
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {step.id === 'bill' ? (
                    <div className="matters__bill">
                      <p>AI Usage</p>
                      <dl>
                        <div>
                          <dt>Employees</dt>
                          <dd>{peopleN.toLocaleString()}</dd>
                        </div>
                        <div>
                          <dt>Queries / day</dt>
                          <dd>{queryN.toLocaleString()}</dd>
                        </div>
                      </dl>
                      <p className="matters__formula">
                        {BILL.employees} × {BILL.queries} queries/day
                      </p>
                      <div className="matters__total">
                        <span>This month</span>
                        <strong>${monthN.toLocaleString()}</strong>
                      </div>
                      <small>Metered cloud, high end of the range.</small>
                    </div>
                  ) : null}
                </div>
              </div>
              <p className="matters__blurb">{step.blurb}</p>
              <p className="matters__step-num">{step.num}</p>
              <h4 className="matters__step-title">{step.title}</h4>
              <p className="matters__step-body">{step.body}</p>
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="matters__replay"
          onClick={() => setRunId((n) => n + 1)}
          aria-label="Replay animation"
        >
          <ReloadIcon />
        </button>
      </div>

      <div className="matters__foot">
        <p>
          Your data is valuable. <span>Keep it where it belongs.</span>
        </p>
        <ul className="matters__values">
          {VALUES.map((item) => (
            <li key={item.label}>
              <Ico name={item.ico} />
              {item.label}
            </li>
          ))}
        </ul>
        <SplitCta size="lg" label="See a better way" href="#meet-fort-knox" />
      </div>
    </section>
  )
}

export default WhyItMatters
