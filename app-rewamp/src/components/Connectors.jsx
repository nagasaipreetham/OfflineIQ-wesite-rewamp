import { useLayoutEffect, useRef, useState } from 'react'
import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import './Connectors.css'

const SIDES = ['top', 'right', 'bottom', 'left']

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

function placeConnectors(items) {
  const n = items.length
  const base = Math.floor(n / SIDES.length)
  const extra = n % SIDES.length
  const counts = {
    top: base + (extra > 0 ? 1 : 0),
    right: base + (extra > 2 ? 1 : 0),
    bottom: base + (extra > 1 ? 1 : 0),
    left: base,
  }

  let index = 0
  return SIDES.reduce((acc, side) => {
    const count = counts[side]
    acc[side] = items.slice(index, index + count)
    index += count
    return acc
  }, {})
}

const PLACED = placeConnectors(CONNECTORS)

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

  if (side === 'top' || side === 'bottom') {
    const midY = sy + (ty - sy) * 0.3
    return `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${sx.toFixed(1)} ${midY.toFixed(1)} L ${tx.toFixed(1)} ${midY.toFixed(1)} L ${tx.toFixed(1)} ${ty.toFixed(1)}`
  }

  const midX = sx + (tx - sx) * 0.55
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${midX.toFixed(1)} ${sy.toFixed(1)} L ${midX.toFixed(1)} ${ty.toFixed(1)} L ${tx.toFixed(1)} ${ty.toFixed(1)}`
}

function Port({ portRef }) {
  return (
    <span className="conn__port" ref={portRef} aria-hidden="true">
      <span className="conn__port-dot" />
    </span>
  )
}

function ConnectorCard({ name, src, side, portRef }) {
  return (
    <article
      className={`conn__card conn__card--${side}`}
      aria-label={name}
    >
      <Port portRef={portRef} />
      <img className="conn__logo" src={src} alt="" />
      <span className="conn__name" aria-hidden="true">
        {name}
      </span>
    </article>
  )
}

function Connectors() {
  const boardRef = useRef(null)
  const stubPortRefs = useRef({})
  const cardPortRefs = useRef({})
  const [wires, setWires] = useState([])
  const [wireBox, setWireBox] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const board = boardRef.current
    if (!board) return undefined

    const paint = () => {
      const origin = board.getBoundingClientRect()
      if (origin.width < 8 || origin.height < 8) return

      setWireBox((prev) =>
        prev.width === origin.width && prev.height === origin.height
          ? prev
          : { width: origin.width, height: origin.height },
      )

      const next = []
      SIDES.forEach((side) => {
        PLACED[side].forEach((item) => {
          const key = `${side}-${item.id}`
          const stubPort = stubPortRefs.current[key]
          const cardPort = cardPortRefs.current[key]
          if (!stubPort || !cardPort) return
          if (stubPort.getBoundingClientRect().width < 4) return
          next.push(
            dashPath(
              side,
              portAnchor(stubPort, origin, side, 'stub'),
              portAnchor(cardPort, origin, side, 'card'),
            ),
          )
        })
      })
      setWires(next)
    }

    paint()
    const frame = requestAnimationFrame(paint)
    const ro = new ResizeObserver(paint)
    ro.observe(board)
    window.addEventListener('resize', paint)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', paint)
    }
  }, [])

  return (
    <section className="conn" id="connectors">
      <ShellInner>
        <SectionPin>
          <h2 className="conn__title">
            <span className="conn__num" aria-hidden="true">
              {greekNumeral(7)}.
            </span>
            <span className="conn__label">Connectors</span>
          </h2>
          <div className="conn__rule" aria-hidden="true" />
        </SectionPin>

        <div className="conn__intro">
          <h3 className="conn__heading">
            Fort Knox pulls from where the data already lives.
          </h3>
        </div>

        <div className="conn__board" ref={boardRef}>
          <svg
            className="conn__wires"
            viewBox={
              wireBox.width && wireBox.height
                ? `0 0 ${wireBox.width} ${wireBox.height}`
                : '0 0 100 100'
            }
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {wires.map((d, i) => (
              <path key={i} className="conn__wire" d={d} />
            ))}
          </svg>

          {SIDES.map((side) => {
            const items = PLACED[side]
            if (!items.length) return null
            return (
              <div
                key={side}
                className={`conn__side conn__side--${side}`}
                style={{ '--count': items.length }}
              >
                {items.map((item) => (
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
            )
          })}

          <div className="conn__core">
            <div className="conn__device">
              <img
                className="conn__image"
                src="/fortknox-closed.png"
                alt="Fort Knox, closed"
              />
              {SIDES.flatMap((side) =>
                PLACED[side].map((item, i) => (
                  <span
                    key={`${side}-${item.id}`}
                    className={`conn__stub conn__stub--${side}`}
                    style={{ '--i': i, '--count': PLACED[side].length }}
                    aria-hidden="true"
                  >
                    <span className="conn__lead" />
                    <Port
                      portRef={(el) => {
                        stubPortRefs.current[`${side}-${item.id}`] = el
                      }}
                    />
                  </span>
                )),
              )}
            </div>
          </div>
        </div>
      </ShellInner>
    </section>
  )
}

export default Connectors
