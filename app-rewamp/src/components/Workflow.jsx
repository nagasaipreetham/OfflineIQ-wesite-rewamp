import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import './Workflow.css'

const PHASES = ['idle', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'hold']

const NODES = [
  {
    id: 'inbox',
    kind: 'Content',
    title: 'New file in Review',
    body: 'Starts when a document enters the local inbox.',
    ico: 'play',
    tone: 'dark',
    status: 'Ready',
  },
  {
    id: 'summary',
    kind: 'Create',
    title: 'Document Summary',
    body: 'Create a cited summary before review begins.',
    ico: 'file',
    tone: 'light',
    status: 'Ready',
  },
  {
    id: 'review',
    kind: 'Review',
    title: 'Review',
    body: 'Find issues, risks, and concerns.',
    ico: 'shield',
    tone: 'light',
    status: 'Ready',
  },
  {
    id: 'decide',
    kind: 'Control',
    title: 'Ready to send?',
    body: 'Decide the next path from the review result.',
    ico: 'split',
    tone: 'dark',
    status: 'Ready',
  },
  {
    id: 'approve',
    kind: 'Control',
    title: 'Human approval',
    body: 'Pause until a person approves or rejects it.',
    ico: 'user',
    tone: 'dark',
    status: 'Ready',
  },
  {
    id: 'rewrite',
    kind: 'Create',
    title: 'Rewrite',
    body: 'Improve the draft when the review finds issues.',
    ico: 'pencil',
    tone: 'light',
    status: 'Ready',
  },
]

const EDGES = [
  { id: 'w12', from: 'inbox', to: 'summary', label: 'Then', on: 'n2' },
  { id: 'w23', from: 'summary', to: 'review', label: 'Then', on: 'n3' },
  { id: 'w34', from: 'review', to: 'decide', label: 'Then', on: 'n4' },
  { id: 'w45', from: 'decide', to: 'approve', label: 'Ready', on: 'n5', branch: true, bias: 'left' },
  { id: 'w46', from: 'decide', to: 'rewrite', label: 'Needs changes', on: 'n6', branch: true, bias: 'right' },
]

const EMPTY_WIRES = EDGES.map(() => ({ d: '', x: 0, y: 0 }))
const RUN_LIMIT_MS = 5 * 60 * 1000
const PHASE_DELAY = {
  idle: 280,
  n1: 800,
  n2: 800,
  n3: 800,
  n4: 800,
  n5: 700,
  n6: 800,
  hold: 1800,
}

function phaseIndex(phase) {
  const i = PHASES.indexOf(phase)
  return i < 0 ? 0 : i
}

function nodeOn(phase, id) {
  const order = ['inbox', 'summary', 'review', 'decide', 'approve', 'rewrite']
  const n = order.indexOf(id) + 1
  return phaseIndex(phase) >= n
}

function edgeOn(phase, on) {
  return phaseIndex(phase) >= phaseIndex(on)
}

function currentNode(phase) {
  return (
    {
      n1: 'inbox',
      n2: 'summary',
      n3: 'review',
      n4: 'decide',
      n5: 'approve',
      n6: 'rewrite',
    }[phase] || null
  )
}

function pointOf(el, origin) {
  const r = el.getBoundingClientRect()
  return {
    x: r.left - origin.left + r.width / 2,
    y: r.top - origin.top + r.height / 2,
  }
}

function hopPath(from, to, stacked, branch, bias) {
  if (!from || !to) return ''
  const x1 = from.x.toFixed(1)
  const y1 = from.y.toFixed(1)
  const x2 = to.x.toFixed(1)
  const y2 = to.y.toFixed(1)
  if (stacked) {
    const sweep = bias === 'left' ? -40 : bias === 'right' ? 40 : 0
    const midY = ((from.y + to.y) / 2).toFixed(1)
    const midX = (from.x + sweep).toFixed(1)
    return `M ${x1} ${y1} C ${midX} ${from.y.toFixed(1)}, ${midX} ${to.y.toFixed(1)}, ${x2} ${y2}`
  }
  if (branch) {
    const dx = Math.max(to.x - from.x, 72)
    const c1 = (from.x + dx * 0.55).toFixed(1)
    const c2 = (to.x - 6).toFixed(1)
    return `M ${x1} ${y1} C ${c1} ${y1}, ${c2} ${y2}, ${x2} ${y2}`
  }
  return `M ${x1} ${y1} L ${x2} ${y2}`
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path className="is-solid" d="M7.2 5.5h3.2v13H7.2zM13.6 5.5h3.2v13h-3.2z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path className="is-solid" d="M8.2 5.6v12.8L18.4 12z" />
    </svg>
  )
}

function Tick({ pos }) {
  return <span className={`wf__tick wf__tick--${pos}`} aria-hidden="true" />
}

function NodeIco({ name }) {
  if (name === 'play') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path className="is-solid" d="M9 7.2 17.2 12 9 16.8z" />
      </svg>
    )
  }
  if (name === 'file') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4h7.2L18 8.8V20H7z" />
        <path d="M14.2 4v4.8H18" />
        <path d="M9.4 12.4h5.4M9.4 15.6h4.2" />
      </svg>
    )
  }
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.6 19 6.4v5.4c0 4.2-3 7.4-7 8.8-4-1.4-7-4.6-7-8.8V6.4z" />
      </svg>
    )
  }
  if (name === 'split') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path className="is-solid" d="M12 5.2 18.4 12 12 18.8 5.6 12z" />
      </svg>
    )
  }
  if (name === 'user') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="9" r="2.8" />
        <path d="M6.4 18.2c1.2-2.8 3.3-4.2 5.6-4.2s4.4 1.4 5.6 4.2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19h4.2L18.4 9.8a2 2 0 0 0-2.8-2.8L6.4 16.2z" />
      <path d="M14.4 8.2l2.8 2.8" />
    </svg>
  )
}

function FlowNode({ node, on, current, outRef, inRef }) {
  return (
    <article
      className={`wf__node wf__node--${node.tone}${on ? ' is-on' : ''}${
        current ? ' is-now' : ''
      }`}
    >
      {inRef ? (
        <i className={`wf__port wf__port--in${on ? ' is-on' : ''}`} ref={inRef} />
      ) : null}
      <header>
        <span className="wf__avatar">
          <NodeIco name={node.ico} />
        </span>
        <span>{node.kind}</span>
      </header>
      <h4>{node.title}</h4>
      <p>{node.body}</p>
      <small>{node.status}</small>
      {outRef ? (
        <i className={`wf__port wf__port--out${on ? ' is-on' : ''}`} ref={outRef} />
      ) : null}
    </article>
  )
}

function Workflow() {
  const boardRef = useRef(null)
  const outRefs = useRef({})
  const inRefs = useRef({})
  const startedAtRef = useRef(0)
  const elapsedRef = useRef(0)
  const [runId, setRunId] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [stacked, setStacked] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [wires, setWires] = useState(EMPTY_WIRES)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)')
    const sync = () => setStacked(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const board = boardRef.current
    if (!board) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRunId((n) => (n === 0 ? 1 : n))
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(board)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setPhase('hold')
      setPlaying(false)
      return undefined
    }
    if (runId === 0 || !playing) return undefined

    const now = Date.now()
    if (!startedAtRef.current) startedAtRef.current = now
    const elapsed = elapsedRef.current + (now - startedAtRef.current)
    if (elapsed >= RUN_LIMIT_MS) {
      elapsedRef.current = elapsed
      startedAtRef.current = 0
      setPhase('hold')
      setPlaying(false)
      return undefined
    }

    const next = phase === 'hold' ? 'n1' : PHASES[PHASES.indexOf(phase) + 1] || 'n1'
    const delay = Math.min(PHASE_DELAY[phase] ?? 800, RUN_LIMIT_MS - elapsed)
    const id = window.setTimeout(() => {
      const t = Date.now()
      const e = elapsedRef.current + (t - startedAtRef.current)
      if (e >= RUN_LIMIT_MS) {
        elapsedRef.current = e
        startedAtRef.current = 0
        setPhase('hold')
        setPlaying(false)
        return
      }
      setPhase(next)
    }, delay)

    return () => window.clearTimeout(id)
  }, [runId, playing, phase])

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
      setWires(
        EDGES.map((edge) => {
          const from = outRefs.current[edge.from]
            ? pointOf(outRefs.current[edge.from], origin)
            : null
          const to = inRefs.current[edge.to]
            ? pointOf(inRefs.current[edge.to], origin)
            : null
          const d = hopPath(from, to, stacked, edge.branch, edge.bias)
          if (!from || !to) return { d: '', x: 0, y: 0 }
          return {
            d,
            x: (from.x + to.x) / 2,
            y: edge.branch
              ? from.y + (to.y - from.y) * 0.38
              : (from.y + to.y) / 2,
          }
        }),
      )
    }

    paint()
    const ro = new ResizeObserver(paint)
    ro.observe(board)
    window.addEventListener('resize', paint)
    const frame = window.requestAnimationFrame(paint)
    return () => {
      window.cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', paint)
    }
  }, [phase, stacked])

  const chain = NODES.slice(0, 4)
  const fork = NODES.slice(4)

  return (
    <section className="wf" id="workflow">
      <ShellInner>
        <SectionPin>
          <h2 className="wf__title">
            <span className="wf__label">Workflow</span>
          </h2>
          <div className="wf__rule" aria-hidden="true" />
        </SectionPin>

        <div className="wf__intro">
          <p className="wf__kicker">App workflows</p>
          <h3 className="wf__heading">
            One App Handles a Task.{' '}
            <mark className="wf__mark">A Workflow Handles the Job.</mark>
          </h3>
          <p className="wf__lead">
            Bring multiple apps together to handle a complete process from the
            first document to the final review. Each step feeds the next, so your
            team can build workflows around the way work actually gets done.
          </p>
        </div>

      <div
        className={`wf__board is-${phase}${stacked ? ' is-stack' : ''}`}
        ref={boardRef}
        aria-label="App workflow from intake to human approval"
      >
        <Tick pos="tl" />
        <Tick pos="tr" />
        <Tick pos="bl" />
        <Tick pos="br" />
        <p className="wf__brand">OfflineIQ</p>
        <p className="wf__brand wf__brand--right">Redact for sharing</p>

        <svg
          className="wf__wires"
          viewBox={box.w && box.h ? `0 0 ${box.w} ${box.h}` : '0 0 100 100'}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {EDGES.map((edge, i) => (
            <path
              key={edge.id}
              className={`wf__wire wf__wire--${edge.id}${
                edgeOn(phase, edge.on) ? ' is-on' : ''
              }`}
              d={wires[i]?.d || ''}
              pathLength="1"
            />
          ))}
        </svg>

        {EDGES.filter((edge) => edge.branch).map((edge) => {
          const i = EDGES.indexOf(edge)
          return wires[i]?.d ? (
            <span
              key={edge.id}
              className={`wf__chip wf__chip--${edge.id}${
                edgeOn(phase, edge.on) ? ' is-on' : ''
              }`}
              style={{ left: wires[i].x, top: wires[i].y }}
            >
              {edge.label}
            </span>
          ) : null
        })}

        <div className="wf__stage">
          {chain.map((node, i) => (
            <Fragment key={node.id}>
              <div className={`wf__col wf__col--${node.id}`}>
                <FlowNode
                  node={node}
                  on={nodeOn(phase, node.id)}
                  current={currentNode(phase) === node.id}
                  inRef={
                    i === 0
                      ? undefined
                      : (el) => {
                          inRefs.current[node.id] = el
                        }
                  }
                  outRef={(el) => {
                    outRefs.current[node.id] = el
                  }}
                />
              </div>
              {i < 3 ? (
                <span
                  className={`wf__then${
                    edgeOn(phase, EDGES[i].on) ? ' is-on' : ''
                  }`}
                >
                  Then
                </span>
              ) : null}
            </Fragment>
          ))}

          <div className="wf__fork">
            {fork.map((node) => (
              <div key={node.id} className={`wf__col wf__col--${node.id}`}>
                <FlowNode
                  node={node}
                  on={nodeOn(phase, node.id)}
                  current={currentNode(phase) === node.id}
                  inRef={(el) => {
                    inRefs.current[node.id] = el
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="wf__toggle"
          onClick={() => {
            setPlaying((on) => {
              if (on) {
                if (startedAtRef.current) {
                  elapsedRef.current += Date.now() - startedAtRef.current
                  startedAtRef.current = 0
                }
                return false
              }
              if (elapsedRef.current >= RUN_LIMIT_MS) elapsedRef.current = 0
              startedAtRef.current = Date.now()
              return true
            })
          }}
          aria-pressed={!playing}
          aria-label={playing ? 'Pause workflow' : 'Play workflow'}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <p className="wf__rail">Each step feeds the next</p>
        <p className="wf__rail wf__rail--right">On your hardware</p>
      </div>
      </ShellInner>
    </section>
  )
}

export default Workflow
