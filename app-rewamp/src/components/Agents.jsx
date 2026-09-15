import { useLayoutEffect, useRef, useState } from 'react'
import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import './Agents.css'

export const GROUPS = [
  {
    id: 'creation',
    label: 'Creation',
    side: 'left',
    corner: 'top',
    agents: [
      {
        id: 'draft',
        name: 'Draft',
        blurb:
          'A first version grounded in your own templates, not a blank page.',
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
    side: 'right',
    corner: 'top',
    agents: [
      {
        id: 'review',
        name: 'Review',
        blurb: 'Flag what changed, what\u2019s missing, or what breaks from standard.',
      },
      {
        id: 'compare',
        name: 'Compare',
        blurb: 'Two versions of a contract in, one flagged difference out.',
      },
      {
        id: 'validation',
        name: 'Validation',
        blurb: 'Check a document or record against a defined standard.',
      },
      {
        id: 'redaction',
        name: 'Redaction',
        blurb: 'Remove what shouldn\u2019t leave the room, automatically.',
      },
    ],
  },
  {
    id: 'understanding',
    label: 'Understanding',
    side: 'left',
    corner: 'bottom',
    agents: [
      {
        id: 'summarization',
        name: 'Summarization',
        blurb: 'A patient record condensed to what the next reader needs.',
      },
      {
        id: 'analysis',
        name: 'Analysis',
        blurb: 'Surface patterns, risks, or figures buried in a corpus.',
      },
      {
        id: 'prep',
        name: 'Prep',
        blurb: 'Assemble briefing material ahead of a meeting, hearing, or review.',
      },
    ],
  },
  {
    id: 'organization',
    label: 'Organization',
    side: 'right',
    corner: 'bottom',
    agents: [
      {
        id: 'extraction',
        name: 'Extraction',
        blurb: 'A hundred invoices in, structured data out.',
      },
      {
        id: 'classification',
        name: 'Classification',
        blurb: 'Sort and tag documents at volume, consistently.',
      },
      {
        id: 'similar',
        name: 'Similar-Items',
        blurb: 'Find every document in the corpus that resembles this one.',
      },
    ],
  },
]

const DEFAULT_CAPTION = 'Coordinated intelligence on your hardware.'

export function AgentIcon({ name }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  switch (name) {
    case 'draft':
      return (
        <svg {...common}>
          <path d="M6.4 3.6h7.1L18 8.2V20.4H6.4z" />
          <path d="M13.4 3.6v4.7h4.6" />
          <path d="M11.2 18.4 19.2 10.4a1.6 1.6 0 0 0-2.3-2.3L8.9 16.1 8.2 19.1z" />
        </svg>
      )
    case 'rewrite':
      return (
        <svg {...common}>
          <path d="M4.4 19.6h4.4L19.2 9.2a2.05 2.05 0 0 0-2.9-2.9L5.9 16.7z" />
          <path d="M14.8 7.8l2.9 2.9" />
        </svg>
      )
    case 'translation':
      return (
        <svg {...common}>
          <text
            x="3.2"
            y="17.2"
            fill="currentColor"
            stroke="none"
            fontFamily="serif"
            fontSize="11.5"
            fontWeight="600"
          >
            文
          </text>
          <text
            x="13.6"
            y="18.4"
            fill="currentColor"
            stroke="none"
            fontFamily="Georgia, serif"
            fontSize="12"
            fontWeight="700"
          >
            A
          </text>
        </svg>
      )
    case 'review':
      return (
        <svg {...common}>
          <path d="M5.6 3.8h7.2L17.4 8.4V13" />
          <path d="M12.7 3.8v4.7h4.7" />
          <path d="M5.6 3.8v16.4h5.2" />
          <circle cx="15.2" cy="16.1" r="3.1" />
          <path d="M17.4 18.4 20.2 21" />
        </svg>
      )
    case 'compare':
      return (
        <svg {...common}>
          <rect x="3.8" y="5.4" width="9.2" height="13.2" rx="1" />
          <rect x="11" y="5.4" width="9.2" height="13.2" rx="1" />
          <path d="M6.4 9.2h4M6.4 12.2h3.2M14 9.2h3.6M14 12.2h2.6" />
        </svg>
      )
    case 'validation':
      return (
        <svg {...common}>
          <path d="M12 3.2 19.6 6.2v5.6c0 4.5-3.1 7.6-7.6 9.4C7.5 19.4 4.4 16.3 4.4 11.8V6.2z" />
          <path d="M8.3 12.1 10.8 14.7 15.7 9.5" />
        </svg>
      )
    case 'redaction':
      return (
        <svg {...common}>
          <path d="M6.2 3.5h7.2L18.2 8.3V20.5H6.2z" />
          <path d="M13.3 3.5v4.8h4.9" />
          <path d="M8.4 12.1h7.4M8.4 15.6h5.6" strokeWidth="2.15" />
        </svg>
      )
    case 'summarization':
      return (
        <svg {...common}>
          <path d="M5.5 7.2h13M5.5 12h13M5.5 16.8h8.2" />
        </svg>
      )
    case 'analysis':
      return (
        <svg {...common}>
          <path d="M4.4 19.4h15.2" />
          <path d="M7.2 19.4V12.6" />
          <path d="M12 19.4V6.6" />
          <path d="M16.8 19.4v-5.4" />
        </svg>
      )
    case 'prep':
      return (
        <svg {...common}>
          <path d="M12 3.8a6.1 6.1 0 0 1 3.5 11.1v2.1H8.5v-2.1A6.1 6.1 0 0 1 12 3.8z" />
          <path d="M9.5 19.2h5M10.3 21h3.4" />
        </svg>
      )
    case 'extraction':
      return (
        <svg {...common}>
          <rect x="7.4" y="7.4" width="9.2" height="9.2" rx="0.6" />
          <path d="M4.6 4.6h3.2M4.6 4.6v3.2M19.4 4.6h-3.2M19.4 4.6v3.2M4.6 19.4h3.2M4.6 19.4v-3.2M19.4 19.4h-3.2M19.4 19.4v-3.2" />
        </svg>
      )
    case 'classification':
      return (
        <svg {...common}>
          <circle cx="12" cy="5.2" r="1.7" />
          <circle cx="6" cy="18.6" r="1.7" />
          <circle cx="12" cy="18.6" r="1.7" />
          <circle cx="18" cy="18.6" r="1.7" />
          <path d="M12 6.9v4.8M12 11.7H6v5M12 11.7h6v5" />
        </svg>
      )
    case 'similar':
      return (
        <svg {...common}>
          <rect x="3.8" y="6.6" width="10.6" height="13" rx="1" />
          <path d="M9.8 4.6h10.4v13h-4.2" />
        </svg>
      )
    default:
      return null
  }
}

function wirePath(sx, sy, tx, ty) {
  const mx = sx + (tx - sx) * 0.46
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${mx.toFixed(1)} ${sy.toFixed(1)} L ${tx.toFixed(1)} ${ty.toFixed(1)}`
}

function Agents() {
  const [activeId, setActiveId] = useState(null)
  const boardRef = useRef(null)
  const deviceRef = useRef(null)
  const labelRefs = useRef({})
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
      const box = device.getBoundingClientRect()
      if (origin.width < 8 || origin.height < 8) return

      setWireBox((prev) =>
        prev.width === origin.width && prev.height === origin.height
          ? prev
          : { width: origin.width, height: origin.height },
      )

      const next = GROUPS.map((group) => {
        const label = labelRefs.current[group.id]
        if (!label) return null
        const r = label.getBoundingClientRect()
        const fromX =
          group.side === 'right'
            ? box.left + box.width * 0.8 - origin.left
            : box.left + box.width * 0.2 - origin.left
        const fromY =
          group.corner === 'top'
            ? box.top - origin.top + box.height * 0.22
            : box.top - origin.top + box.height * 0.48
        const toX =
          group.side === 'right'
            ? r.left - origin.left
            : r.right - origin.left
        const toY = r.top + r.height / 2 - origin.top
        return wirePath(fromX, fromY, toX, toY)
      }).filter(Boolean)

      setWires(next)
    }

    paint()
    const ro = new ResizeObserver(paint)
    ro.observe(board)
    ro.observe(device)
    GROUPS.forEach((group) => {
      const el = labelRefs.current[group.id]
      if (el) ro.observe(el)
    })
    window.addEventListener('resize', paint)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', paint)
    }
  }, [])

  return (
    <section className="agents" id="apps">
      <ShellInner>
        <SectionPin>
          <h2 className="agents__title">
            <span className="agents__label">13 Apps</span>
          </h2>
          <div className="agents__rule" aria-hidden="true" />
        </SectionPin>

        <div className="agents__intro">
          <p className="agents__kicker">13 specialized apps</p>
          <h3 className="agents__heading">App Workbench</h3>
        </div>

        <div className="agents__board" ref={boardRef}>
          <span className="agents__plus agents__plus--tl" aria-hidden="true" />
          <span className="agents__plus agents__plus--tr" aria-hidden="true" />
          <span className="agents__plus agents__plus--bl" aria-hidden="true" />
          <span className="agents__plus agents__plus--br" aria-hidden="true" />

          <svg
            className="agents__wires"
            viewBox={
              wireBox.width && wireBox.height
                ? `0 0 ${wireBox.width} ${wireBox.height}`
                : '0 0 100 100'
            }
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {wires.map((d, i) => (
              <path key={i} className="agents__wire" d={d} />
            ))}
          </svg>

          {GROUPS.map((group) => (
            <article
              key={group.id}
              className={`agents__group agents__group--${group.id}`}
            >
              <h3
                className="agents__group-label"
                ref={(el) => {
                  labelRefs.current[group.id] = el
                }}
              >
                {group.label}
              </h3>
              <ul className="agents__cluster">
                {group.agents.map((agent) => (
                  <li key={agent.id}>
                    <button
                      type="button"
                      className={`agents__agent${activeId === agent.id ? ' is-active' : ''}`}
                      aria-pressed={activeId === agent.id}
                      onMouseEnter={() => setActiveId(agent.id)}
                      onFocus={() => setActiveId(agent.id)}
                      onClick={() => setActiveId(agent.id)}
                    >
                      <span className="agents__tile">
                        <AgentIcon name={agent.id} />
                      </span>
                      <span className="agents__copy">
                        <span className="agents__name">{agent.name}</span>
                        <span className="agents__blurb">{agent.blurb}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <div className="agents__core">
            <div className="agents__device" ref={deviceRef}>
              <img
                className="agents__image"
                src="/fort-knox.png"
                alt="Fort Knox hardware"
              />
            </div>
            <p
              className={`agents__caption${active ? ' is-agent' : ''}`}
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
        </div>
      </ShellInner>
    </section>
  )
}

export default Agents
