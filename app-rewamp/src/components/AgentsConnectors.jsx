import { useLayoutEffect, useRef, useState } from 'react'
import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import { AgentIcon, GROUPS } from './Agents.jsx'
import './AgentsConnectors.css'

const CONNECTORS = [
  { id: 'snowflake', name: 'Snowflake', src: '/connectors/snowflake.svg' },
  { id: 'bigquery', name: 'Google BigQuery', src: '/connectors/googlebigquery.svg' },
  { id: 'redshift', name: 'Amazon Redshift', src: '/connectors/redshift.svg' },
  { id: 'databricks', name: 'Databricks', src: '/connectors/databricks.svg' },
  { id: 'oracle', name: 'Oracle', src: '/connectors/oracle.svg' },
  { id: 'mongodb', name: 'MongoDB', src: '/connectors/mongodb.svg' },
  { id: 'redis', name: 'Redis', src: '/connectors/redis.svg' },
  { id: 's3', name: 'Amazon S3', src: '/connectors/amazon-s3.svg' },
  { id: 'elasticsearch', name: 'Elasticsearch', src: '/connectors/elasticsearch.svg' },
  { id: 'google-drive', name: 'Google Drive', src: '/connectors/google-drive.svg' },
  { id: 'sharepoint', name: 'SharePoint', src: '/connectors/microsoft-sharepoint.svg' },
  { id: 'postgresql', name: 'PostgreSQL', src: '/connectors/postgresql.svg' },
  { id: 'mysql', name: 'MySQL', src: '/connectors/mysql.svg' },
  { id: 'sql-server', name: 'SQL Server', src: '/connectors/sql-server.svg' },
]

const PLACED = {
  top: CONNECTORS.slice(0, 4),
  right: [...CONNECTORS.slice(4, 7), ...CONNECTORS.slice(9, 11)],
  left: [...CONNECTORS.slice(11, 14), ...CONNECTORS.slice(7, 9)],
}

const TOP_GROUPS = GROUPS.filter((group) => group.corner === 'top')
const BOTTOM_GROUPS = GROUPS.filter((group) => group.corner === 'bottom')
const DEFAULT_CAPTION = 'Coordinated intelligence on your hardware.'

function portAnchor(el, origin, side, role) {
  const r = el.getBoundingClientRect()
  const x = r.left - origin.left
  const y = r.top - origin.top
  const cx = x + r.width / 2
  const cy = y + r.height / 2

  if (side === 'top') {
    return role === 'stub' ? { x: cx, y } : { x: cx, y: y + r.height }
  }
  if (side === 'bottom') {
    return role === 'stub' ? { x: cx, y: y + r.height } : { x: cx, y }
  }
  if (side === 'left') {
    return role === 'stub' ? { x, y: cy } : { x: x + r.width, y: cy }
  }
  return role === 'stub' ? { x: x + r.width, y: cy } : { x, y: cy }
}

function dashPath(side, from, to) {
  const sx = from.x
  const sy = from.y
  const tx = to.x
  const ty = to.y

  if (side === 'top') {
    const midY = sy + (ty - sy) * 0.3
    return `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${sx.toFixed(1)} ${midY.toFixed(1)} L ${tx.toFixed(1)} ${midY.toFixed(1)} L ${tx.toFixed(1)} ${ty.toFixed(1)}`
  }

  const midX = sx + (tx - sx) * 0.55
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${midX.toFixed(1)} ${sy.toFixed(1)} L ${midX.toFixed(1)} ${ty.toFixed(1)} L ${tx.toFixed(1)} ${ty.toFixed(1)}`
}

function labelTop(el, origin) {
  const r = el.getBoundingClientRect()
  return {
    x: r.left + r.width / 2 - origin.left,
    y: r.top - origin.top,
  }
}

function upToHub(from, to) {
  const sx = from.x
  const sy = from.y
  const tx = to.x
  const ty = to.y
  const f = (n) => n.toFixed(1)
  if (Math.abs(tx - sx) < 12) {
    return `M ${f(sx)} ${f(sy)} L ${f(tx)} ${f(ty)}`
  }
  const midY = ty + Math.max(12, (sy - ty) * 0.2)
  return `M ${f(sx)} ${f(sy)} L ${f(sx)} ${f(midY)} L ${f(tx)} ${f(midY)} L ${f(tx)} ${f(ty)}`
}

function Port({ portRef }) {
  return (
    <span className="hub__port" ref={portRef} aria-hidden="true">
      <span className="hub__port-dot" />
    </span>
  )
}

function ConnectorCard({ name, src, side, portRef }) {
  return (
    <article className={`hub__card hub__card--${side}`} aria-label={name}>
      <Port portRef={portRef} />
      <img className="hub__logo" src={src} alt="" />
      <span className="hub__card-name">{name}</span>
    </article>
  )
}

function AgentGroup({ group, activeId, setActiveId, labelRef }) {
  return (
    <article className="hub__group">
      <h3
        className="hub__group-label"
        ref={labelRef}
      >
        {group.label}
      </h3>
      <ul className="hub__cluster">
        {group.agents.map((agent) => (
          <li key={agent.id}>
            <button
              type="button"
              className={`hub__agent${activeId === agent.id ? ' is-active' : ''}`}
              aria-pressed={activeId === agent.id}
              onMouseEnter={() => setActiveId(agent.id)}
              onFocus={() => setActiveId(agent.id)}
              onClick={() => setActiveId(agent.id)}
            >
              <span className="hub__tile">
                <AgentIcon name={agent.id} />
              </span>
              <span className="hub__copy">
                <span className="hub__name">{agent.name}</span>
                <span className="hub__blurb">{agent.blurb}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}

function AgentsConnectors() {
  const [activeId, setActiveId] = useState(null)
  const boardRef = useRef(null)
  const deviceRef = useRef(null)
  const labelRefs = useRef({})
  const stubPortRefs = useRef({})
  const cardPortRefs = useRef({})
  const agentStubRef = useRef(null)
  const agentsBtnRef = useRef(null)
  const [wires, setWires] = useState([])
  const [wireBox, setWireBox] = useState({ width: 0, height: 0 })

  const active = GROUPS.flatMap((group) => group.agents).find(
    (agent) => agent.id === activeId,
  )

  useLayoutEffect(() => {
    const board = boardRef.current
    const device = deviceRef.current
    if (!board || !device) return undefined

    const paint = () => {
      const origin = board.getBoundingClientRect()
      if (origin.width < 8 || origin.height < 8) return

      setWireBox((prev) =>
        prev.width === origin.width && prev.height === origin.height
          ? prev
          : { width: origin.width, height: origin.height },
      )

      const next = []

      ;['top', 'left', 'right'].forEach((side) => {
        PLACED[side].forEach((item) => {
          const key = `${side}-${item.id}`
          const stubPort = stubPortRefs.current[key]
          const cardPort = cardPortRefs.current[key]
          if (!stubPort || !cardPort) return
          if (stubPort.getBoundingClientRect().width < 4) return
          next.push({
            kind: 'conn',
            d: dashPath(
              side,
              portAnchor(stubPort, origin, side, 'stub'),
              portAnchor(cardPort, origin, side, 'card'),
            ),
          })
        })
      })

      const agentStub = agentStubRef.current
      const agentsBtn = agentsBtnRef.current
      const hubReady =
        agentStub &&
        agentsBtn &&
        agentStub.getBoundingClientRect().width >= 4 &&
        agentsBtn.getBoundingClientRect().width >= 4

      if (hubReady) {
        const btn = agentsBtn.getBoundingClientRect()
        const bx = btn.left - origin.left
        const by = btn.top - origin.top
        const bw = btn.width
        const bh = btn.height
        const stub = portAnchor(agentStub, origin, 'bottom', 'stub')

        next.push({
          kind: 'agent',
          d: `M ${stub.x.toFixed(1)} ${stub.y.toFixed(1)} L ${(bx + bw / 2).toFixed(1)} ${by.toFixed(1)}`,
        })

        const slots = [
          { group: TOP_GROUPS[0], t: 0.18 },
          { group: BOTTOM_GROUPS[0], t: 0.38 },
          { group: BOTTOM_GROUPS[1], t: 0.62 },
          { group: TOP_GROUPS[1], t: 0.82 },
        ]

        slots.forEach(({ group, t }) => {
          if (!group) return
          const label = labelRefs.current[group.id]
          if (!label || label.getBoundingClientRect().width < 4) return
          next.push({
            kind: 'agent',
            d: upToHub(labelTop(label, origin), {
              x: bx + bw * t,
              y: by + bh,
            }),
          })
        })
      }

      setWires(next)
    }

    paint()
    const frame = window.requestAnimationFrame(paint)
    const ro = new ResizeObserver(paint)
    ro.observe(board)
    ro.observe(device)
    if (agentsBtnRef.current) ro.observe(agentsBtnRef.current)
    GROUPS.forEach((group) => {
      const el = labelRefs.current[group.id]
      if (el) ro.observe(el)
    })
    window.addEventListener('resize', paint)
    return () => {
      window.cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', paint)
    }
  }, [])

  return (
    <section className="hub" id="agents">
      <div className="hub__jump" id="connectors" />
      <ShellInner>
        <SectionPin>
          <h2 className="hub__title">
            <span className="hub__num" aria-hidden="true">
              {greekNumeral(7)}.
            </span>
            <span className="hub__label">Agents &amp; Connectors</span>
          </h2>
          <div className="hub__rule" aria-hidden="true" />
        </SectionPin>

        <div className="hub__intro">
          <p className="hub__kicker">13 specialized agents · 14 connectors</p>
          <h3 className="hub__heading">
            Fort Knox pulls from where the data already lives.
          </h3>
        </div>

        <div className="hub__board" ref={boardRef}>
          <span className="hub__plus hub__plus--tl" aria-hidden="true" />
          <span className="hub__plus hub__plus--tr" aria-hidden="true" />
          <span className="hub__plus hub__plus--bl" aria-hidden="true" />
          <span className="hub__plus hub__plus--br" aria-hidden="true" />

          <svg
            className="hub__wires"
            viewBox={
              wireBox.width && wireBox.height
                ? `0 0 ${wireBox.width} ${wireBox.height}`
                : '0 0 100 100'
            }
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {wires.map((wire, i) => (
              <path
                key={`${wire.kind}-${i}`}
                className={`hub__wire hub__wire--${wire.kind}`}
                d={wire.d}
              />
            ))}
          </svg>

          <div className="hub__stage">
            <div className="hub__conns-all">
              {['top', 'left', 'right'].map((side) => (
                <div
                  key={side}
                  className={`hub__side hub__side--${side}`}
                  style={{ '--count': PLACED[side].length }}
                >
                  {PLACED[side].map((item) => (
                    <ConnectorCard
                      key={item.id}
                      side={side}
                      portRef={(el) => {
                        cardPortRefs.current[`${side}-${item.id}`] = el
                      }}
                      {...item}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="hub__core">
              <div className="hub__device" ref={deviceRef}>
                <img
                  className="hub__image"
                  src="/fort-knox.png"
                  alt="Fort Knox hardware"
                />
                {['top', 'left', 'right'].flatMap((side) =>
                  PLACED[side].map((item, i) => (
                    <span
                      key={`${side}-${item.id}`}
                      className={`hub__stub hub__stub--${side}`}
                      style={{ '--i': i, '--count': PLACED[side].length }}
                      aria-hidden="true"
                    >
                      <span className="hub__lead" />
                      <Port
                        portRef={(el) => {
                          stubPortRefs.current[`${side}-${item.id}`] = el
                        }}
                      />
                    </span>
                  )),
                )}
                <span className="hub__stub hub__stub--bottom" aria-hidden="true">
                  <span className="hub__lead" />
                  <Port portRef={agentStubRef} />
                </span>
                <div className="hub__agents-btn" ref={agentsBtnRef}>
                  AGENTS
                </div>
              </div>
            </div>
          </div>

          <div className="hub__agents">
            <div className="hub__agents-row hub__agents-row--wide">
              {TOP_GROUPS.map((group) => (
                <AgentGroup
                  key={group.id}
                  group={group}
                  activeId={activeId}
                  setActiveId={setActiveId}
                  labelRef={(el) => {
                    labelRefs.current[group.id] = el
                  }}
                />
              ))}
            </div>
            <div className="hub__agents-row hub__agents-row--tight">
              {BOTTOM_GROUPS.map((group) => (
                <AgentGroup
                  key={group.id}
                  group={group}
                  activeId={activeId}
                  setActiveId={setActiveId}
                  labelRef={(el) => {
                    labelRefs.current[group.id] = el
                  }}
                />
              ))}
            </div>
          </div>

          <p
            className={`hub__caption${active ? ' is-agent' : ''}`}
            aria-live="polite"
          >
            <span>
              {active ? (
                <>
                  <strong>{active.name}.</strong> {active.blurb}
                </>
              ) : (
                DEFAULT_CAPTION
              )}
            </span>
          </p>
        </div>
      </ShellInner>
    </section>
  )
}

export default AgentsConnectors
