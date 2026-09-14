import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Shell, { ShellInner } from '../components/Shell.jsx'
import SectionSep from '../components/SectionSep.jsx'
import SectionPin from '../components/SectionPin.jsx'
import Contact from '../components/Contact.jsx'
import { SplitCta } from '../components/Button.jsx'
import { AgentIcon } from '../components/Agents.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import { usePageMeta } from '../lib/usePageMeta.js'
import PipelineFlow from '../components/PipelineFlow.jsx'
import './PlatformPage.css'

const TITLE = 'The Platform | 13 AI Agents Trained on Your Data | OfflineIQ'
const DESCRIPTION =
  'Draft, review, compare, and extract with 13 purpose-built AI agents, grounded in your own corpus, all running locally.'
const KEYWORDS = 'private AI agents for enterprise, on-premise document AI'

const HERO_CHIPS = [
  'Private AI agents',
  'On-premise document AI',
  'Every answer cited',
]

const GROUPS = [
  {
    id: 'creation',
    label: 'Creation',
    agents: [
      {
        id: 'draft',
        name: 'Draft',
        blurb:
          'A first version grounded in your own templates and precedent.',
      },
      {
        id: 'rewrite',
        name: 'Rewrite',
        blurb:
          'Revise tone, length, or structure without losing the source meaning.',
      },
      {
        id: 'translation',
        name: 'Translation',
        blurb:
          'Move a document between languages without sending it anywhere to do it.',
      },
    ],
  },
  {
    id: 'review',
    label: 'Review',
    agents: [
      {
        id: 'review',
        name: 'Review',
        blurb:
          'Flag what changed, what\u2019s missing, or what breaks from standard.',
      },
      {
        id: 'compare',
        name: 'Compare',
        blurb:
          'Set two versions side by side, surface exactly what\u2019s different.',
      },
      {
        id: 'validation',
        name: 'Validation',
        blurb: 'Check a document or record against a defined standard.',
      },
      {
        id: 'redaction',
        name: 'Redaction',
        blurb:
          'Remove what shouldn\u2019t leave the room, automatically, at volume.',
      },
    ],
  },
  {
    id: 'understanding',
    label: 'Understanding',
    agents: [
      {
        id: 'summarization',
        name: 'Summarization',
        blurb: 'Condense a long document into what the next reader needs.',
      },
      {
        id: 'analysis',
        name: 'Analysis',
        blurb: 'Surface patterns, risks, or figures buried in a corpus.',
      },
      {
        id: 'prep',
        name: 'Prep',
        blurb:
          'Assemble briefing material ahead of a meeting, hearing, or review.',
      },
    ],
  },
  {
    id: 'organization',
    label: 'Organization',
    agents: [
      {
        id: 'extraction',
        name: 'Extraction',
        blurb:
          'Pull structured data out of unstructured documents, at volume.',
      },
      {
        id: 'classification',
        name: 'Classification',
        blurb: 'Sort and tag documents consistently, at scale.',
      },
      {
        id: 'similar',
        name: 'Similar-Items',
        blurb: 'Find every document in the corpus that resembles this one.',
      },
    ],
  },
]

const ALL_AGENTS = GROUPS.flatMap((group) =>
  group.agents.map((agent) => ({ ...agent, group: group.id, groupLabel: group.label })),
)

const LAYERS = [
  {
    id: 'prioritization',
    num: '1',
    name: 'Prioritization',
    body: 'The signed OR prep protocol outranks a charge-nurse note. The model learns what governs, so the answer does not drift as the chart pile grows.',
    lead: 'The governing protocol is weighted first.',
  },
  {
    id: 'source',
    num: '2',
    name: 'Source discovery',
    body: 'It follows the protocol it can cite. A ward email that sounds alike is a hint, not a source.',
    lead: 'Similar wording is not a citation.',
  },
  {
    id: 'change',
    num: '3',
    name: 'Change detection',
    body: 'A restyled header is ignored. A rewritten antibiotic window is not.',
    lead: 'Cosmetic edits drop out. The clinical rewrite stays.',
  },
  {
    id: 'compare',
    num: '4',
    name: 'Comparative analysis',
    body: 'Two protocol versions, read as an audit: what was added, removed, or rewritten — not a word-diff dump.',
    lead: 'A clinical change log, not a redline dump.',
  },
]

const LAYER_MS = 3600

const TWIN_DOCS = [
  { id: 'policy', label: 'Policy.pdf' },
  { id: 'memo', label: 'Memo.docx' },
  { id: 'msa', label: 'MSA.pdf' },
  { id: 'notes', label: 'Notes.xlsx' },
]

const TWIN_LEAVES = [
  { id: 'policy', label: 'Policy.pdf', dir: 'n' },
  { id: 'memo', label: 'Memo.docx', dir: 'e' },
  { id: 'notes', label: 'Notes.xlsx', dir: 's' },
  { id: 'msa', label: 'MSA.pdf', dir: 'w' },
]

const TWIN_HIT = {
  id: 'msa',
  question: 'What changed in the MSA?',
  answer: 'Clause 4.2 now caps liability at twelve months of fees.',
  cite: 'MSA.pdf · p. 11 · cited',
}

const INGEST = [
  { id: 'postgresql', name: 'PostgreSQL', src: '/connectors/postgresql.svg' },
  { id: 'sql-server', name: 'SQL Server', src: '/connectors/sql-server.svg' },
  { id: 'mysql', name: 'MySQL', src: '/connectors/mysql.svg' },
  { id: 'oracle', name: 'Oracle', src: '/connectors/oracle.svg' },
  { id: 'mongodb', name: 'MongoDB', src: '/connectors/mongodb.svg' },
  { id: 'snowflake', name: 'Snowflake', src: '/connectors/snowflake.svg' },
  { id: 'redshift', name: 'Redshift', src: '/connectors/redshift.svg' },
  { id: 'bigquery', name: 'BigQuery', src: '/connectors/googlebigquery.svg' },
  { id: 'databricks', name: 'Databricks', src: '/connectors/databricks.svg' },
  { id: 'elasticsearch', name: 'Elasticsearch', src: '/connectors/elasticsearch.svg' },
  { id: 'redis', name: 'Redis', src: '/connectors/redis.svg' },
  { id: 's3', name: 'Amazon S3', src: '/connectors/amazon-s3.svg' },
  { id: 'google-drive', name: 'Google Drive', src: '/connectors/google-drive.svg' },
  { id: 'sharepoint', name: 'SharePoint', src: '/connectors/microsoft-sharepoint.svg' },
]

const TWIN_CHAR_MS = 42
const TWIN_MS = {
  ingest: 1400,
  model: 1800,
  settle: 0,
  query: 500,
  press: 180,
  plane: 640,
  load: 2000,
  cite: 2400,
  clear: 600,
}

function Tick({ pos }) {
  return <span className={`pl-tick pl-tick--${pos}`} aria-hidden="true" />
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

    const visible = (node) => {
      const r = node.getBoundingClientRect()
      return r.bottom > 32 && r.top < window.innerHeight - 24
    }

    const pending = new Set(nodes.filter((node) => {
      if (visible(node)) {
        node.classList.add('is-in')
        return false
      }
      return true
    }))

    if (pending.size === 0) return undefined

    let io
    const flush = () => {
      pending.forEach((node) => {
        if (!visible(node)) return
        node.classList.add('is-in')
        pending.delete(node)
        io?.unobserve(node)
      })
    }

    io = new IntersectionObserver(
      () => flush(),
      { threshold: 0, rootMargin: '40px 0px 40px 0px' },
    )

    pending.forEach((node) => io.observe(node))
    window.addEventListener('scroll', flush, { passive: true })
    document.addEventListener('scroll', flush, { passive: true, capture: true })
    flush()
    const safety = window.setTimeout(() => {
      pending.forEach((node) => node.classList.add('is-in'))
      pending.clear()
    }, 2500)

    return () => {
      window.clearTimeout(safety)
      io.disconnect()
      window.removeEventListener('scroll', flush)
      document.removeEventListener('scroll', flush, { capture: true })
    }
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

function PinTitle({ n, label }) {
  return (
    <SectionPin>
      <h2 className="pl-pin">
        <span className="pl-pin__num" aria-hidden="true">
          {greekNumeral(n)}.
        </span>
        <span className="pl-pin__label">{label}</span>
      </h2>
      <div className="pl-pin__rule" aria-hidden="true" />
    </SectionPin>
  )
}

function TwinPlaneGlyph() {
  return (
    <svg className="pl-twin__plane" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </svg>
  )
}

function boxCenter(el, origin) {
  const r = el.getBoundingClientRect()
  return {
    x: r.left - origin.left + r.width / 2,
    y: r.top - origin.top + r.height / 2,
    w: r.width,
    h: r.height,
  }
}

function edgePoint(box, toward) {
  const dx = toward.x - box.x
  const dy = toward.y - box.y
  if (dx === 0 && dy === 0) return { x: box.x, y: box.y }
  const hw = box.w / 2
  const hh = box.h / 2
  if (Math.abs(dx) * hh >= Math.abs(dy) * hw) {
    const sx = dx < 0 ? -1 : 1
    return { x: box.x + sx * hw, y: box.y + (dy / dx) * sx * hw }
  }
  const sy = dy < 0 ? -1 : 1
  return { x: box.x + (dx / dy) * sy * hh, y: box.y + sy * hh }
}

function TwinStage() {
  const [ref, on] = useInView(0.12)
  const [phase, setPhase] = useState('idle')
  const [hit, setHit] = useState(null)
  const [typed, setTyped] = useState('')
  const [caretOn, setCaretOn] = useState(false)
  const [sendPhase, setSendPhase] = useState('idle')
  const [cycle, setCycle] = useState(0)
  const [seen, setSeen] = useState(false)
  const [paths, setPaths] = useState([])
  const [view, setView] = useState({ w: 200, h: 200 })
  const reduceRef = useRef(false)
  const sentRef = useRef(false)
  const sendDelayRef = useRef(0)
  const typerRef = useRef(0)
  const graphRef = useRef(null)
  const hubRef = useRef(null)
  const leafRefs = useRef({})

  useEffect(() => {
    reduceRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceRef.current) {
      setPhase('cite')
      setHit(TWIN_HIT.id)
      setTyped(TWIN_HIT.question)
      setSendPhase('sent')
    }
  }, [])

  const sendQuery = () => {
    if (sentRef.current) return
    sentRef.current = true
    setCaretOn(false)
    setSendPhase('press')
    window.clearTimeout(sendDelayRef.current)
    sendDelayRef.current = window.setTimeout(() => {
      setSendPhase('plane')
      sendDelayRef.current = window.setTimeout(() => {
        setPhase('load')
        setSendPhase('load')
        sendDelayRef.current = window.setTimeout(() => {
          setHit(TWIN_HIT.id)
          setPhase('cite')
          setSendPhase('sent')
        }, TWIN_MS.load)
      }, TWIN_MS.plane)
    }, TWIN_MS.press)
  }

  useEffect(() => {
    if (on) setSeen(true)
  }, [on])

  useEffect(() => {
    if (!seen || reduceRef.current) return undefined
    sentRef.current = false
    window.clearTimeout(sendDelayRef.current)
    window.clearInterval(typerRef.current)
    setHit(null)
    setTyped('')
    setCaretOn(false)
    setSendPhase('idle')
    setPhase('ingest')

    const timers = []
    const later = (fn, ms) => {
      timers.push(window.setTimeout(fn, ms))
    }

    later(() => setPhase('model'), TWIN_MS.ingest)

    const typeAt = TWIN_MS.ingest + TWIN_MS.model
    later(() => {
      setPhase('type')
      setCaretOn(true)
      let i = 0
      typerRef.current = window.setInterval(() => {
        i += 1
        setTyped(TWIN_HIT.question.slice(0, i))
        if (i >= TWIN_HIT.question.length) {
          window.clearInterval(typerRef.current)
          typerRef.current = 0
        }
      }, TWIN_CHAR_MS)
    }, typeAt)

    const typedMs = TWIN_HIT.question.length * TWIN_CHAR_MS
    later(() => {
      setCaretOn(false)
      setPhase('query')
      setSendPhase('ready')
    }, typeAt + typedMs + TWIN_MS.settle)

    later(
      () => sendQuery(),
      typeAt + typedMs + TWIN_MS.settle + TWIN_MS.query,
    )

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      window.clearTimeout(sendDelayRef.current)
      window.clearInterval(typerRef.current)
    }
  }, [seen, cycle])

  useEffect(() => {
    if (!seen || reduceRef.current || phase !== 'cite') return undefined
    const id = window.setTimeout(() => {
      setHit(null)
      setTyped('')
      setCaretOn(false)
      setSendPhase('idle')
      setPhase('clear')
    }, TWIN_MS.cite)
    return () => window.clearTimeout(id)
  }, [seen, phase, cycle])

  useEffect(() => {
    if (!seen || reduceRef.current || phase !== 'clear') return undefined
    const id = window.setTimeout(() => setCycle((n) => n + 1), TWIN_MS.clear)
    return () => window.clearTimeout(id)
  }, [seen, phase, cycle])

  useLayoutEffect(() => {
    const graph = graphRef.current
    const hub = hubRef.current
    if (!graph || !hub) return undefined

    const draw = () => {
      const origin = graph.getBoundingClientRect()
      if (origin.width < 8 || origin.height < 8) return
      setView({ w: origin.width, h: origin.height })
      const hb = boxCenter(hub, origin)
      setPaths(
        TWIN_LEAVES.map((leaf) => {
          const el = leafRefs.current[leaf.id]
          if (!el) return { id: leaf.id, d: '' }
          const lb = boxCenter(el, origin)
          const a = edgePoint(hb, lb)
          const b = edgePoint(lb, hb)
          return {
            id: leaf.id,
            d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`,
          }
        }),
      )
    }

    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(graph)
    ro.observe(hub)
    TWIN_LEAVES.forEach((leaf) => {
      const el = leafRefs.current[leaf.id]
      if (el) ro.observe(el)
    })
    const settle = window.setTimeout(draw, 520)
    return () => {
      ro.disconnect()
      window.clearTimeout(settle)
    }
  }, [phase, seen])

  const canSend = phase === 'query' && sendPhase === 'ready'
  const composing = typed.length > 0 || caretOn
  const loading = phase === 'load' || sendPhase === 'load'

  return (
    <div
      ref={ref}
      className={`pl-twin is-${phase}${on ? ' is-live' : ''}${hit ? ' is-hit' : ''}`}
      aria-label="Documents stay in a private model. A question comes back with a citation."
    >
      <div className="pl-twin__col pl-twin__col--in">
        <p className="pl-twin__kicker">Corpus in</p>
        <ul className="pl-twin__docs">
          {TWIN_DOCS.map((doc, i) => (
            <li
              key={doc.id}
              className={`pl-twin__doc${hit === doc.id ? ' is-hit' : ''}`}
              style={{ '--i': i }}
            >
              <span className="pl-twin__sheet" aria-hidden="true" />
              {doc.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="pl-twin__col pl-twin__col--mid">
        <p className="pl-twin__kicker">Private model</p>
        <div className="pl-twin__graph" ref={graphRef}>
          <svg
            className="pl-twin__links"
            viewBox={`0 0 ${view.w} ${view.h}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {paths.map((path) => (
              <path
                key={path.id}
                className={hit === path.id ? 'is-on' : ''}
                d={path.d}
              />
            ))}
          </svg>
          <span
            className={`pl-twin__hub${loading ? ' is-load' : ''}`}
            ref={hubRef}
          >
            {loading ? (
              <span className="pl-twin__load" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            ) : (
              'MODEL'
            )}
          </span>
          {TWIN_LEAVES.map((leaf, i) => (
            <span
              key={leaf.id}
              ref={(el) => {
                leafRefs.current[leaf.id] = el
              }}
              className={`pl-twin__leaf pl-twin__leaf--${leaf.dir}${hit === leaf.id ? ' is-on' : ''}`}
              style={{ '--i': i }}
            >
              {leaf.label}
            </span>
          ))}
        </div>
      </div>

      <div className="pl-twin__col pl-twin__col--out">
        <p className="pl-twin__kicker">Answer out</p>
        <div className="pl-twin__ask">
          <div className={`pl-twin__query${composing ? ' is-live' : ''}`}>
            {composing ? (
              <span className="pl-twin__typed">
                {typed}
                {caretOn && <i className="pl-twin__caret" />}
              </span>
            ) : (
              <span className="pl-twin__placeholder">
                What&rsquo;s on your mind today?
              </span>
            )}
          </div>
          <button
            type="button"
            className={`pl-twin__send${sendPhase === 'press' ? ' is-press' : ''}${sendPhase === 'plane' ? ' is-plane' : ''}${sendPhase === 'sent' ? ' is-sent' : ''}`}
            onClick={sendQuery}
            aria-disabled={!canSend}
            aria-label="Send question"
          >
            {sendPhase !== 'plane' && <TwinPlaneGlyph />}
            {sendPhase === 'plane' && (
              <>
                <span className="pl-twin__plane-fly">
                  <TwinPlaneGlyph />
                </span>
                <span className="pl-twin__plane-enter">
                  <TwinPlaneGlyph />
                </span>
              </>
            )}
          </button>
        </div>
        <div className="pl-twin__answer" aria-live="polite">
          <p>{TWIN_HIT.answer}</p>
          <p className="pl-twin__cite">{TWIN_HIT.cite}</p>
        </div>
      </div>
    </div>
  )
}

function flowElbow(axis, from, to, mid) {
  if (axis === 'x') {
    const midX = mid ?? from.x + (to.x - from.x) * 0.32
    return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} L ${midX.toFixed(1)} ${from.y.toFixed(1)} L ${midX.toFixed(1)} ${to.y.toFixed(1)} L ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
  }
  const midY = mid ?? from.y + (to.y - from.y) * 0.38
  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} L ${from.x.toFixed(1)} ${midY.toFixed(1)} L ${to.x.toFixed(1)} ${midY.toFixed(1)} L ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
}

function sourceIndexes(count, cols, stacked) {
  if (count < 1 || cols < 1) return []
  if (!stacked) {
    const lastCol = Array.from({ length: count }, (_, i) => i).filter(
      (i) => i % cols === cols - 1,
    )
    const remainder = count % cols
    if (remainder === 0) return lastCol
    return [...lastCol, count - 1]
  }
  return Array.from({ length: cols }, (_, col) => {
    const rows = Math.ceil((count - col) / cols)
    return col + (rows - 1) * cols
  }).filter((i) => i >= 0 && i < count)
}

function FlowStage() {
  const boardRef = useRef(null)
  const gridRef = useRef(null)
  const unitRef = useRef(null)
  const cardRefs = useRef([])
  const [wires, setWires] = useState([])
  const [box, setBox] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const board = boardRef.current
    const grid = gridRef.current
    const unit = unitRef.current
    if (!board || !grid || !unit) return undefined

    const paint = () => {
      const origin = board.getBoundingClientRect()
      const unitBox = unit.getBoundingClientRect()
      const gridBox = grid.getBoundingClientRect()
      if (origin.width < 8 || origin.height < 8) return

      setBox((prev) =>
        prev.w === origin.width && prev.h === origin.height
          ? prev
          : { w: origin.width, h: origin.height },
      )

      const cols = getComputedStyle(grid)
        .gridTemplateColumns.split(' ')
        .filter(Boolean).length
      const stacked = unitBox.top > gridBox.bottom - 12
      const axis = stacked ? 'y' : 'x'
      const sources = sourceIndexes(INGEST.length, cols, stacked)
        .map((i) => cardRefs.current[i])
        .filter(Boolean)
      if (!sources.length) {
        setWires([])
        return
      }

      const froms = sources.map((el) => {
        const r = el.getBoundingClientRect()
        return stacked
          ? {
              x: r.left - origin.left + r.width / 2,
              y: r.bottom - origin.top,
            }
          : {
              x: r.right - origin.left,
              y: r.top - origin.top + r.height / 2,
            }
      })
      const to = stacked
        ? {
            x: unitBox.left - origin.left + unitBox.width * 0.5,
            y: unitBox.top - origin.top + unitBox.height * 0.18,
          }
        : {
            x: unitBox.left - origin.left + unitBox.width * 0.16,
            y: unitBox.top - origin.top + unitBox.height * 0.5,
          }
      const gapEdge = stacked
        ? unitBox.top - origin.top
        : unitBox.left - origin.left
      const startEdge = stacked
        ? Math.max(...froms.map((p) => p.y))
        : Math.max(...froms.map((p) => p.x))
      const mid = startEdge + (gapEdge - startEdge) * (stacked ? 0.5 : 0.55)

      const next = froms.map((from) => flowElbow(axis, from, to, mid))
      setWires(next)
    }

    paint()
    const frame = window.requestAnimationFrame(paint)
    const ro = new ResizeObserver(paint)
    ro.observe(board)
    ro.observe(grid)
    ro.observe(unit)
    unit.addEventListener('load', paint)
    window.addEventListener('resize', paint)
    const mqStack = window.matchMedia('(max-width: 1024px)')
    const mqIcons = window.matchMedia('(max-width: 720px)')
    mqStack.addEventListener('change', paint)
    mqIcons.addEventListener('change', paint)
    return () => {
      window.cancelAnimationFrame(frame)
      ro.disconnect()
      unit.removeEventListener('load', paint)
      window.removeEventListener('resize', paint)
      mqStack.removeEventListener('change', paint)
      mqIcons.removeEventListener('change', paint)
    }
  }, [])

  return (
    <div className="pl-flow" ref={boardRef}>
      <svg
        className="pl-flow__wires"
        viewBox={box.w && box.h ? `0 0 ${box.w} ${box.h}` : '0 0 100 100'}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {wires.map((d, i) => (
          <path key={i} className="pl-flow__wire" d={d} />
        ))}
      </svg>

      <ul className="pl-flow__grid" ref={gridRef}>
        {INGEST.map((item, i) => (
          <li
            key={item.id}
            className="pl-flow__card"
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            aria-label={item.name}
          >
            <img src={item.src} alt="" />
            <span>{item.name}</span>
          </li>
        ))}
      </ul>

      <figure className="pl-flow__unit">
        <img
          ref={unitRef}
          src="/fort-knox.png"
          alt="Fort Knox, where ingested data stays"
        />
        <figcaption>Fort Knox · network boundary</figcaption>
      </figure>
    </div>
  )
}

function LayerDemo({ id }) {
  if (id === 'prioritization') {
    return (
      <div className="pl-mini pl-mini--prio">
        <p className="pl-mini__ask">
          “When must antibiotics be given before incision?”
        </p>
        <ul>
          {[
            { name: 'OR-Prep-Protocol.pdf', why: 'Governing protocol', w: 94, on: true },
            { name: 'Infection-Control.pdf', why: 'Related policy', w: 58, on: false },
            { name: 'Charge-Notes.xlsx', why: 'Shift scratch notes', w: 24, on: false },
            { name: 'Handoff.docx', why: 'Old ward handoff', w: 16, on: false },
          ].map((row) => (
            <li key={row.name} className={row.on ? 'is-on' : ''} style={{ '--w': row.w }}>
              <span>
                <b>{row.name}</b>
                <em>{row.why}</em>
              </span>
              <span className="pl-mini__bar" />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (id === 'source') {
    return (
      <div className="pl-mini pl-mini--source">
        <p className="pl-mini__ask">
          “When must antibiotics be given before incision?”
        </p>
        <div className="pl-mini__path is-miss">
          <span className="pl-mini__tag">Similar</span>
          <strong>Ward-email.txt</strong>
          <span>“We usually give it an hour before”</span>
        </div>
        <div className="pl-mini__path is-hit">
          <span className="pl-mini__tag">Cited</span>
          <strong>OR-Prep-Protocol.pdf · p. 4</strong>
          <span>Prophylaxis within 60 minutes of incision</span>
        </div>
      </div>
    )
  }

  if (id === 'change') {
    return (
      <div className="pl-mini pl-mini--change">
        <p className="pl-mini__ask">OR-Prep-Protocol.pdf · v3.2 → v4.1</p>
        <ul>
          <li className="is-noise">
            <span>Ignored</span>
            Header colour restyled
          </li>
          <li className="is-noise">
            <span>Ignored</span>
            Page numbers reflowed
          </li>
          <li className="is-signal">
            <span>Flagged</span>
            Antibiotic window rewritten
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div className="pl-mini pl-mini--audit">
      <p className="pl-mini__ask">OR-Prep-Protocol.pdf · v3.2 → v4.1</p>
      <ul>
        <li>
          <span>Changed</span>
          Window: 60 minutes → 30 minutes
        </li>
        <li>
          <span>Added</span>
          Documented allergy check
        </li>
        <li>
          <span>Removed</span>
          Standing vancomycin order
        </li>
      </ul>
    </div>
  )
}

function LayersStage({ live }) {
  const [layer, setLayer] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const hold = paused || !live || reduce
  const item = LAYERS[layer]

  return (
    <div
      className={`pl-layers${hold ? ' is-paused' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pl-layers__list">
        {LAYERS.map((entry, i) => (
          <button
            key={entry.id}
            type="button"
            className={`pl-layer${layer === i ? ' is-on' : ''}`}
            onClick={() => setLayer(i)}
            aria-pressed={layer === i}
          >
            <span className="pl-layer__num" aria-hidden="true">
              {entry.num}
            </span>
            <span className="pl-layer__copy">
              <strong>{entry.name}</strong>
              <span>{entry.body}</span>
            </span>
            {layer === i && !reduce ? (
              <span className="pl-layer__load" aria-hidden="true">
                <i
                  key={layer}
                  style={{ '--layer-ms': `${LAYER_MS}ms` }}
                  onAnimationEnd={() => {
                    if (hold) return
                    setLayer((prev) => (prev + 1) % LAYERS.length)
                  }}
                />
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="pl-layers__stage" key={item.id}>
        <p className="pl-layers__stage-label">{item.name}</p>
        <p className="pl-layers__stage-lead">{item.lead}</p>
        <LayerDemo id={item.id} />
      </div>
    </div>
  )
}

function PlatformPage() {
  const revealRef = useReveal()
  const [heroRef, heroOn] = useInView(0.2)
  const [layerRef, layersOn] = useInView(0.25)
  const [picked, setPicked] = useState('draft')
  const [count, setCount] = useState(13)

  usePageMeta({
    title: TITLE,
    description: DESCRIPTION,
    keywords: KEYWORDS,
    image: '/fort-knox.png',
    path: '/platform',
  })

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !heroOn) return undefined
    setCount(0)
    let n = 0
    const id = window.setInterval(() => {
      n += 1
      setCount(n)
      if (n >= 13) window.clearInterval(id)
    }, 70)
    return () => window.clearInterval(id)
  }, [heroOn])

  return (
    <main className="pl" ref={revealRef}>
      <section className="pl-hero" aria-labelledby="pl-hero-title" ref={heroRef}>
        <div className="pl-hero__field" aria-hidden="true" />

        <div className="pl-hero__inner">
          <div className="pl-hero__visual" style={{ '--i': 0 }}>
            <Tick pos="tl" />
            <Tick pos="tr" />
            <Tick pos="bl" />
            <Tick pos="br" />
            <p className="pl-hero__count">
              <span>{count}</span>
              <small>agents</small>
            </p>
            <div className="pl-mosaic" aria-hidden="true">
              {ALL_AGENTS.map((agent, i) => (
                <span
                  key={agent.id}
                  className="pl-mosaic__cell"
                  style={{ '--i': i }}
                >
                  <AgentIcon name={agent.id} />
                </span>
              ))}
            </div>
            <p className="pl-hero__mosaic-cap">One private model</p>
          </div>

          <div className="pl-hero__copy">
            <p className="pl-hero__badge" style={{ '--i': 1 }}>
              <span className="pl-hero__mark" aria-hidden="true" />
              On-premise document AI
            </p>

            <h1 className="pl-hero__title" id="pl-hero-title" style={{ '--i': 2 }}>
              <mark className="pl-hero__highlight">Thirteen agents</mark>.{' '}
              <span className="pl-hero__title-line">
                One <mark className="pl-hero__highlight">private model</mark> of
                your company.
              </span>
            </h1>

            <p className="pl-hero__caption" style={{ '--i': 3 }}>
              Draft, review, compare, and extract with purpose-built agents,
              grounded in your own corpus, all running locally.
            </p>

            <ul className="pl-hero__chips" style={{ '--i': 4 }}>
              {HERO_CHIPS.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>

            <div className="pl-hero__actions" style={{ '--i': 5 }}>
              <a className="btn btn--secondary btn--lg" href="#thirteen-agents">
                See the 13 agents
              </a>
              <SplitCta size="lg" />
            </div>
          </div>
        </div>
      </section>

      <Shell>
        <SectionSep />

        <section className="pl-section" id="digital-twin">
          <ShellInner>
            <PinTitle n={1} label="The Digital Twin" />

            <div className="pl-intro" data-reveal>
              <h3 className="pl-heading pl-heading--center">
                <mark className="pl-hero__highlight">Fort Knox</mark> doesn&rsquo;t
                answer from the internet.
              </h3>
              <p className="pl-caption">
                It answers from a model built entirely out of what the organization
                has already written, said, and recorded.
              </p>
            </div>

            <div data-reveal>
              <TwinStage />
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="pl-section" id="underneath" ref={layerRef}>
          <ShellInner>
            <PinTitle n={2} label="Under every answer" />

            <div className="pl-intro" data-reveal>
              <h3 className="pl-heading pl-heading--center">
                The answer is the last thing you see.
              </h3>
              <p className="pl-caption">
                Under every reply, Fort Knox has already ranked what governs,
                found the document it can cite, ignored cosmetic noise, and
                read the change itself.
              </p>
            </div>

            <div data-reveal>
              <LayersStage live={layersOn} />
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="pl-section" id="thirteen-agents">
          <ShellInner>
            <PinTitle n={3} label="The 13 agents" />

            <div className="pl-intro" data-reveal>
              <h3 className="pl-heading pl-heading--center">
                <mark className="pl-hero__highlight">Thirteen agents</mark>, grouped
                by the work they do.
              </h3>
              <p className="pl-caption">
                Each one is trained on your corpus. None of them call the internet
                to finish a job.
              </p>
            </div>

            <div className="pl-groups" data-reveal>
              {GROUPS.map((group) => (
                <section
                  key={group.id}
                  className="pl-group"
                  aria-labelledby={`pl-group-${group.id}`}
                >
                  <h4 className="pl-group__label" id={`pl-group-${group.id}`}>
                    {group.label}
                    <span>{group.agents.length}</span>
                  </h4>
                  <ul className="pl-group__list">
                    {group.agents.map((agent) => (
                      <li key={agent.id}>
                        <button
                          type="button"
                          className={`pl-agent${picked === agent.id ? ' is-on' : ''}`}
                          onClick={() => setPicked(agent.id)}
                          aria-pressed={picked === agent.id}
                        >
                          <span className="pl-agent__icon" aria-hidden="true">
                            <AgentIcon name={agent.id} />
                          </span>
                          <span>
                            <strong>{agent.name}</strong>
                            <span>{agent.blurb}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="pl-section" id="pipeline">
          <ShellInner>
            <PinTitle n={4} label="Chain them" />

            <div className="pl-intro" data-reveal>
              <h3 className="pl-heading pl-heading--center">
                Chain them into a{' '}
                <mark className="pl-hero__highlight">pipeline.</mark>
              </h3>
              <p className="pl-caption">
                Run any agent standalone, or connect several into a sequence that
                matches an existing workflow, intake through to output, without
                leaving Fort Knox.
              </p>
            </div>

            <div data-reveal>
              <PipelineFlow />
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <section className="pl-section pl-section--last" id="connectors">
          <ShellInner>
            <PinTitle n={5} label="Connectors" />

            <div className="pl-intro" data-reveal>
              <h3 className="pl-heading pl-heading--center">
                Ingestion is one-way, and it{' '}
                <mark className="pl-hero__highlight">stays inside the network</mark>.
              </h3>
              <p className="pl-caption">
                Data flows in. It does not flow back out to a vendor cloud.
              </p>
            </div>

            <div data-reveal>
              <FlowStage />
            </div>

            <div className="pl-endcta" data-reveal>
              <SplitCta size="lg" />
            </div>
          </ShellInner>
        </section>

        <SectionSep />
        <Contact
          numeral={6}
          heading={
            <>
              <mark className="contact__mark">Thirteen agents</mark>. Sized in a{' '}
              <mark className="contact__mark">conversation</mark>, not a SKU list.
            </>
          }
          description="We map the corpus, the workflow, and which agents actually get used — then we size the box to that, not the other way around."
        />
      </Shell>
    </main>
  )
}

export default PlatformPage
