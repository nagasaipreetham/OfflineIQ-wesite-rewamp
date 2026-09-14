import { useEffect, useRef, useState } from 'react'
import './ContentJourneySims.css'

function Tick({ pos }) {
  return <span className={`cj-tick cj-tick--${pos}`} aria-hidden="true" />
}

function ReloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.2-5.5" />
      <path d="M20 4.5V8.8h-4.3" />
    </svg>
  )
}

function useInView(threshold = 0.28) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => setOn(entry.isIntersecting),
      { threshold, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, on]
}

function useBeats(live, beats, hold = 2800) {
  const [phase, setPhase] = useState(beats[0].id)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setPhase(beats[beats.length - 1].id)
      return undefined
    }
    if (!live) return undefined

    let cancelled = false
    const timers = []
    const later = (fn, ms) => {
      timers.push(window.setTimeout(fn, ms))
    }

    const play = () => {
      if (cancelled) return
      let t = 0
      beats.forEach((beat) => {
        later(() => {
          if (!cancelled) setPhase(beat.id)
        }, t)
        t += beat.ms
      })
      later(play, t + hold)
    }

    play()
    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [live, beats, hold])

  return phase
}

function SimFrame({ label, caption, children }) {
  const [ref, live] = useInView(0.26)
  const [run, setRun] = useState(0)

  return (
    <figure className="cj-sim" ref={ref}>
      <Tick pos="tl" />
      <Tick pos="tr" />
      <Tick pos="bl" />
      <Tick pos="br" />
      <div className="cj-sim__bar">
        <span className="cj-sim__label">{label}</span>
        <button
          type="button"
          className="cj-sim__replay"
          onClick={() => setRun((n) => n + 1)}
          aria-label="Replay animation"
        >
          <ReloadIcon />
        </button>
      </div>
      <div className="cj-sim__stage" key={run}>
        {children(live)}
      </div>
      <figcaption className="cj-sim__caption">{caption}</figcaption>
    </figure>
  )
}

const HMAP_BEATS = [
  { id: 'scatter', ms: 1500 },
  { id: 'weigh', ms: 1200 },
  { id: 'sort', ms: 1500 },
  { id: 'query', ms: 1800 },
  { id: 'hold', ms: 900 },
]

const HMAP_DOCS = [
  { id: 'msa', name: 'MSA 2024', lane: 'active', uses: '148', dx: '86px', dy: '18px' },
  { id: 'sch', name: 'Sch. B', lane: 'active', uses: '91', dx: '64px', dy: '-14px' },
  { id: 'hand', name: 'Handbook', lane: 'active', uses: '64', dx: '92px', dy: '36px' },
  { id: 'play', name: 'Playbook', lane: 'peripheral', uses: '11', dx: '-8px', dy: '12px' },
  { id: 'deck', name: 'Q3 deck', lane: 'peripheral', uses: '7', dx: '12px', dy: '-28px' },
  { id: 'memo', name: '2019 memo', lane: 'archive', uses: '0', dx: '-78px', dy: '-16px' },
  { id: 'pol', name: 'Old policy', lane: 'archive', uses: '0', dx: '-70px', dy: '28px' },
]

const HMAP_STATUS = {
  scatter: 'Every file starts equal. That is the noise.',
  weigh: 'The index reads what the team actually uses.',
  sort: 'Active, peripheral, archived \u2014 a living map.',
  query: 'The query only searches what still governs.',
  hold: 'Precision stays constant as the corpus grows.',
}

function HierarchySim({ live }) {
  const phase = useBeats(live, HMAP_BEATS)

  return (
    <div className={`cj-hmap is-${phase}`}>
      <p className="cj-sim__status">{HMAP_STATUS[phase]}</p>
      <div className="cj-hmap__query">
        <span>Query</span>
        What is the liability cap?
      </div>
      <div className="cj-hmap__lanes">
        {['active', 'peripheral', 'archive'].map((lane) => (
          <div key={lane} className={`cj-hmap__lane cj-hmap__lane--${lane}`}>
            <span className="cj-hmap__lane-name">{lane}</span>
            {HMAP_DOCS.filter((doc) => doc.lane === lane).map((doc) => (
              <article
                key={doc.id}
                className="cj-hmap__doc"
                style={{ '--dx': doc.dx, '--dy': doc.dy }}
              >
                <strong>{doc.name}</strong>
                <em>{doc.uses} uses</em>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const GRAPH_BEATS = [
  { id: 'idle', ms: 700 },
  { id: 'similar', ms: 1500 },
  { id: 'reject', ms: 1100 },
  { id: 'graph', ms: 1500 },
  { id: 'authority', ms: 1700 },
  { id: 'hold', ms: 800 },
]

const GRAPH_STATUS = {
  idle: 'A question enters the corpus.',
  similar: 'Nearest text is a nearby memo \u2014 similar, not governing.',
  reject: 'Similarity is not authority. That path is dropped.',
  graph: 'The graph follows what your own documents cite.',
  authority: 'MSA \u2192 Amendment \u2192 Schedule B.',
  hold: 'The right answer, not the closest paragraph.',
}

function GraphSim({ live }) {
  const phase = useBeats(live, GRAPH_BEATS)

  return (
    <div className={`cj-graph is-${phase}`}>
      <p className="cj-sim__status">{GRAPH_STATUS[phase]}</p>
      <div className="cj-graph__board">
        <svg className="cj-graph__wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path className="cj-graph__edge cj-graph__edge--sim" d="M 50 18 L 20 46" />
          <path className="cj-graph__edge cj-graph__edge--auth" d="M 50 18 L 74 36" />
          <path className="cj-graph__edge cj-graph__edge--auth cj-graph__edge--down" d="M 74 48 L 74 58" />
          <path className="cj-graph__edge cj-graph__edge--auth cj-graph__edge--down" d="M 74 70 L 74 80" />
        </svg>

        <span className="cj-graph__node cj-graph__node--q" style={{ left: '50%', top: '12%' }}>
          <b>Question</b>
          <small>Liability cap?</small>
        </span>
        <span className="cj-graph__node cj-graph__node--memo" style={{ left: '20%', top: '50%' }}>
          <b>Nearby memo</b>
          <small>Similar text</small>
        </span>
        <span className="cj-graph__node cj-graph__node--msa" style={{ left: '74%', top: '40%' }}>
          <b>MSA 2024</b>
          <small>Governing</small>
        </span>
        <span className="cj-graph__node cj-graph__node--amd" style={{ left: '74%', top: '64%' }}>
          <b>Amendment</b>
          <small>Cites MSA 4.2</small>
        </span>
        <span className="cj-graph__node cj-graph__node--sch" style={{ left: '74%', top: '86%' }}>
          <b>Schedule B</b>
          <small>Cites MSA 4.2</small>
        </span>
      </div>
    </div>
  )
}

const TRUST_BEATS = [
  { id: 'idle', ms: 600 },
  { id: 'answer', ms: 1100 },
  { id: 's1', ms: 700 },
  { id: 's2', ms: 700 },
  { id: 's3', ms: 700 },
  { id: 's4', ms: 700 },
  { id: 'score', ms: 1400 },
  { id: 'hold', ms: 800 },
]

const TRUST_SIGNALS = [
  { id: 's1', label: 'Independent sources', note: 'Four documents agree' },
  { id: 's2', label: 'Clause alignment', note: 'Same obligation, same section' },
  { id: 's3', label: 'Recency', note: 'Current MSA, not the 2019 memo' },
  { id: 's4', label: 'Internal citation', note: 'Your team cites this path' },
]

const TRUST_STATUS = {
  idle: 'An answer is cheap. Acting on it is not.',
  answer: 'Draft reply is ready. Verification still runs.',
  s1: 'Signal 1 \u2014 independent sources.',
  s2: 'Signal 2 \u2014 clause alignment.',
  s3: 'Signal 3 \u2014 recency.',
  s4: 'Signal 4 \u2014 internal citation weight.',
  score: 'Four signals. One mathematically derived score.',
  hold: '92 \u2014 strongly grounded. Safe to act.',
}

function TrustSim({ live }) {
  const phase = useBeats(live, TRUST_BEATS)
  const order = ['idle', 'answer', 's1', 's2', 's3', 's4', 'score', 'hold']
  const idx = order.indexOf(phase)
  const score = phase === 'hold' || phase === 'score' ? 92 : idx >= 6 ? 92 : Math.max(0, (idx - 1) * 18)

  return (
    <div className={`cj-trust is-${phase}`}>
      <p className="cj-sim__status">{TRUST_STATUS[phase]}</p>
      <div className="cj-trust__answer">
        Liability is capped at <em>twelve months of fees</em>.
      </div>
      <ul className="cj-trust__signals">
        {TRUST_SIGNALS.map((item, i) => (
          <li key={item.id} className={idx >= i + 2 ? 'is-on' : ''}>
            <span className="cj-trust__box" aria-hidden="true" />
            <div>
              <strong>{item.label}</strong>
              <small>{item.note}</small>
            </div>
          </li>
        ))}
      </ul>
      <div className="cj-trust__meter">
        <div className="cj-trust__track">
          <span className="cj-trust__fill" style={{ width: `${score}%` }} />
        </div>
        <div className="cj-trust__readout">
          <b>{score || '\u2014'}</b>
          <span>{score >= 92 ? 'Strongly grounded' : score ? 'Verifying' : 'Pending'}</span>
        </div>
      </div>
    </div>
  )
}

const CITE_BEATS = [
  { id: 'idle', ms: 700 },
  { id: 'claim', ms: 1100 },
  { id: 'trace', ms: 1300 },
  { id: 'excerpt', ms: 1500 },
  { id: 'hash', ms: 1400 },
  { id: 'lock', ms: 1200 },
  { id: 'hold', ms: 800 },
]

const CITE_STATUS = {
  idle: 'Document-level credit is not enough.',
  claim: 'The claim is isolated from the reply.',
  trace: 'Traced to section, page, and clause.',
  excerpt: 'This is the line that was read.',
  hash: 'Citation record gets a cryptographic fingerprint.',
  lock: 'Sealed. Immutable. Audit-ready.',
  hold: 'Six months from now, you can prove this line.',
}

function CiteSim({ live }) {
  const phase = useBeats(live, CITE_BEATS)

  return (
    <div className={`cj-cite is-${phase}`}>
      <p className="cj-sim__status">{CITE_STATUS[phase]}</p>
      <div className="cj-cite__claim">
        <span>Claim</span>
        Liability is capped at twelve months of fees.
      </div>
      <div className="cj-cite__rail" aria-hidden="true">
        <i />
      </div>
      <div className="cj-cite__src">
        <header>
          <b>MSA 2024</b>
          <small>p. 11 · Clause 4.2</small>
        </header>
        <p>
          … residual liability{' '}
          <mark>is capped at twelve months of fees</mark>
          {' '}under this agreement …
        </p>
      </div>
      <div className="cj-cite__seal">
        <code>sha256 7f3a91c0e2b4…c91e</code>
        <span className="cj-cite__lock">Locked</span>
      </div>
    </div>
  )
}

const MUT_BEATS = [
  { id: 'idle', ms: 800 },
  { id: 'surface', ms: 1600 },
  { id: 'ignore', ms: 1300 },
  { id: 'meaning', ms: 1600 },
  { id: 'alert', ms: 1600 },
  { id: 'hold', ms: 800 },
]

const MUT_STATUS = {
  idle: 'Two updates land on the same contract.',
  surface: '14:02 \u2014 wrapping, italics, a heading restyle.',
  ignore: 'Surface edit. Meaning unchanged. Filtered out.',
  meaning: '14:07 \u2014 one phrase in Clause 4.2 moves.',
  alert: 'Liability cap reduced. Logged and surfaced.',
  hold: 'The knowledge base is monitored, not merely stored.',
}

function MutationSim({ live }) {
  const phase = useBeats(live, MUT_BEATS)

  return (
    <div className={`cj-mut is-${phase}`}>
      <p className="cj-sim__status">{MUT_STATUS[phase]}</p>
      <div className="cj-mut__doc">
        <header>
          <b>MSA 2024</b>
          <small>Clause 4.2</small>
        </header>
        <p className="cj-mut__line cj-mut__line--surface">
          Limitation of Liability
        </p>
        <p className="cj-mut__line cj-mut__line--meaning">
          Liability is capped at{' '}
          <span className="cj-mut__swap">
            <span className="cj-mut__was">twelve months</span>
            <span className="cj-mut__now">six months</span>
          </span>
          {' '}of fees.
        </p>
      </div>
      <ul className="cj-mut__log">
        <li className="cj-mut__event cj-mut__event--surface">
          <span>14:02</span>
          Surface edit · ignored
        </li>
        <li className="cj-mut__event cj-mut__event--meaning">
          <span>14:07</span>
          Meaning changed · liability cap reduced
        </li>
      </ul>
    </div>
  )
}

const AUDIT_BEATS = [
  { id: 'idle', ms: 700 },
  { id: 'dump', ms: 1400 },
  { id: 'fade', ms: 1400 },
  { id: 'rank', ms: 1500 },
  { id: 'explain', ms: 1700 },
  { id: 'hold', ms: 800 },
]

const AUDIT_DIFFS = [
  {
    id: 'fmt',
    kind: 'cosmetic',
    title: 'Paragraph reflow',
    detail: 'Same words. New wrapping.',
  },
  {
    id: 'case',
    kind: 'cosmetic',
    title: 'Heading restyle',
    detail: 'Title Case to sentence case.',
  },
  {
    id: 'cap',
    kind: 'material',
    title: 'Liability cap',
    detail: 'Twelve months \u2192 six months. The obligation itself shifted.',
  },
]

const AUDIT_STATUS = {
  idle: 'Two versions. A list of differences is the easy part.',
  dump: 'Every change is found \u2014 including the ones that do not matter.',
  fade: 'Reflow and restyle drop away.',
  rank: 'The obligation change rises to the top.',
  explain: 'Plain language: the cap was halved.',
  hold: 'Not a track-changes report. A semantic audit.',
}

function AuditSim({ live }) {
  const phase = useBeats(live, AUDIT_BEATS)

  return (
    <div className={`cj-audit is-${phase}`}>
      <p className="cj-sim__status">{AUDIT_STATUS[phase]}</p>
      <div className="cj-audit__pair" aria-hidden="true">
        <span>v1</span>
        <span>v2</span>
      </div>
      <ul className="cj-audit__list">
        {AUDIT_DIFFS.map((item) => (
          <li key={item.id} className={`cj-audit__row cj-audit__row--${item.kind}`}>
            <span className="cj-audit__kind">
              {item.kind === 'material' ? 'High' : 'Cosmetic'}
            </span>
            <div>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const SIM_FOR = {
  'part-01': { label: 'Living index', Sim: HierarchySim },
  'part-02': { label: 'Authority graph', Sim: GraphSim },
  'part-03': { label: 'Trust score', Sim: TrustSim },
  'part-04': { label: 'Clause lock', Sim: CiteSim },
  'part-05': { label: 'Meaning watch', Sim: MutationSim },
  'part-06': { label: 'Semantic audit', Sim: AuditSim },
}

export default function JourneySim({ part }) {
  const spec = SIM_FOR[part.id]
  if (!spec) return null
  const { label, Sim } = spec

  return (
    <SimFrame label={label} caption={part.quote}>
      {(live) => <Sim live={live} />}
    </SimFrame>
  )
}
