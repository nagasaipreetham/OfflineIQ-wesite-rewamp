import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import SectionSep from '../components/SectionSep.jsx'
import Shell from '../components/Shell.jsx'
import Contact from '../components/Contact.jsx'
import './HealthcarePage.css'

const ASK_QUESTION = 'Give me the complete picture of the patient no. - xxxx'
const ASK_CHAR_MS = 42
const ASK_LOOP_GAP_MS = 3000
const REPORT_HOLD_MS = 2000

function PinGlyph() {
  return (
    <svg className="hc-ask__glyph hc-ask__glyph--pin" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function PlaneGlyph() {
  return (
    <svg className="hc-ask__glyph hc-ask__glyph--plane" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </svg>
  )
}

function useAskSimulation() {
  const [phase, setPhase] = useState('idle')
  const [typed, setTyped] = useState('')
  const timers = useRef([])
  const typer = useRef(null)
  const running = useRef(false)
  const runId = useRef(0)

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (typer.current) {
      clearInterval(typer.current)
      typer.current = null
    }
  }, [])

  const clearBoard = useCallback(() => {
    setPhase('idle')
    setTyped('')
  }, [])

  useEffect(
    () => () => {
      running.current = false
      clearTimers()
    },
    [clearTimers],
  )

  const run = useCallback(() => {
    if (!running.current) return

    const id = ++runId.current
    clearTimers()
    clearBoard()

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      setTyped(ASK_QUESTION)
      setPhase('scan')
      return
    }

    setPhase('typing')

    let i = 0
    typer.current = setInterval(() => {
      if (!running.current || runId.current !== id) {
        clearInterval(typer.current)
        typer.current = null
        return
      }
      i += 1
      setTyped(ASK_QUESTION.slice(0, i))
      if (i >= ASK_QUESTION.length && typer.current) {
        clearInterval(typer.current)
        typer.current = null
      }
    }, ASK_CHAR_MS)

    const timing = {
      typing: ASK_QUESTION.length * ASK_CHAR_MS,
      settle: 460,
      press: 240,
      plane: 940,
      request: 950,
      hold: ASK_LOOP_GAP_MS,
    }

    let cursor = timing.typing
    const step = (name, onEnter) => {
      timers.current.push(
        setTimeout(() => {
          if (!running.current || runId.current !== id) return
          onEnter?.()
          setPhase(name)
        }, cursor),
      )
      cursor += timing[name] ?? 0
    }

    step('settle')
    step('press')
    step('plane', () => setTyped(''))
    step('request')

    timers.current.push(
      setTimeout(() => {
        if (!running.current || runId.current !== id) return
        setPhase('scan')
      }, cursor),
    )
  }, [clearBoard, clearTimers])

  const start = useCallback(() => {
    if (running.current) return
    running.current = true
    run()
  }, [run])

  const pause = useCallback(() => {
    if (!running.current) return
    running.current = false
    runId.current += 1
    clearTimers()
    clearBoard()
  }, [clearBoard, clearTimers])

  const completeScan = useCallback(() => {
    if (!running.current) return
    const id = runId.current
    setPhase('report')
    timers.current.push(
      setTimeout(() => {
        if (!running.current || runId.current !== id) return
        setPhase('ready')
      }, REPORT_HOLD_MS),
    )
  }, [])

  return {
    phase,
    typed,
    caretOn: phase === 'typing' || phase === 'settle',
    start,
    pause,
    completeScan,
  }
}

const SCATTER_DOCS = [
  { x: '9%', y: '18%', s: 1, delay: '0s' },
  { x: '24%', y: '48%', s: 0.94, delay: '0.4s' },
  { x: '14%', y: '72%', s: 0.97, delay: '0.85s' },
  { x: '36%', y: '14%', s: 0.92, delay: '0.2s' },
  { x: '41%', y: '42%', s: 0.98, delay: '0.65s' },
  { x: '33%', y: '68%', s: 0.93, delay: '1.1s' },
  { x: '55%', y: '26%', s: 0.96, delay: '0.15s' },
  { x: '58%', y: '56%', s: 0.91, delay: '0.55s' },
  { x: '50%', y: '78%', s: 0.95, delay: '1s' },
  { x: '71%', y: '12%', s: 0.94, delay: '0.3s' },
  { x: '76%', y: '40%', s: 0.98, delay: '0.75s' },
  { x: '69%', y: '66%', s: 0.92, delay: '1.2s' },
  { x: '88%', y: '22%', s: 0.96, delay: '0.45s' },
  { x: '91%', y: '52%', s: 0.93, delay: '0.9s' },
  { x: '85%', y: '76%', s: 0.97, delay: '0.1s' },
]

function DocFace() {
  return (
    <>
      <span className="hc-doc__title" />
      <div className="hc-doc__grid">
        <div className="hc-doc__col">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="hc-doc__col">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </>
  )
}

function ScatterDoc({ x, y, s, delay, docRef }) {
  return (
    <div
      ref={docRef}
      className="hc-doc"
      style={{
        '--x': x,
        '--y': y,
        '--s': s,
        '--delay': delay,
      }}
    >
      <DocFace />
    </div>
  )
}

const STACK_COUNT = 10
const GREEN_FLY = new Set([1, 4, 6, 9])
const EASE_FLY = 'cubic-bezier(0.22, 1, 0.36, 1)'

function relBox(el, origin) {
  const b = el.getBoundingClientRect()
  return {
    x: b.left - origin.left,
    y: b.top - origin.top,
    w: b.width,
    h: b.height,
  }
}

const REPORT_LABS = [
  { name: 'Lactate', value: '6.8 mmol/L', flag: 'critical', note: 'Bowel ischemia / hypoperfusion' },
  { name: 'pH (ABG)', value: '7.21', flag: 'critical', note: 'Metabolic acidosis' },
  { name: 'Creatinine', value: '3.1 mg/dL', flag: 'high', note: 'Acute kidney injury' },
  { name: 'WBC', value: '22.4 ×10⁹/L', flag: 'high', note: 'Systemic inflammation' },
  { name: 'CRP', value: '312 mg/L', flag: 'high', note: 'Severe inflammatory load' },
  { name: 'MAP', value: '54 mmHg', flag: 'critical', note: 'Shock, on norepinephrine' },
]

const REPORT_CITES = [
  { file: 'ct-angio-abdomen-0314.pdf', loc: 'p. 4 · SMA origin' },
  { file: 'op-note-exploratory-lap.docx', loc: '§ Findings · 06:40' },
  { file: 'icu-flowsheet-vitals.csv', loc: '04:18–11:00' },
  { file: 'abg-chem-panel-stat.pdf', loc: 'Lab · 05:02' },
]

function PatientReport() {
  return (
    <div className="hc-dossier">
      <header className="hc-dossier__head">
        <p className="hc-dossier__kicker">Patient no. 4482 · IQ Box extract</p>
        <h3 className="hc-dossier__diag" id="hc-report-title">
          Acute mesenteric ischemia
          <span>SMA thrombosis · bowel necrosis · septic shock</span>
        </h3>
      </header>

      <div className="hc-dossier__grid">
        <section className="hc-dossier__col" aria-label="Report values">
          <div className="hc-dossier__id">
            <p>
              <strong>Marcus Ellison</strong> · 64M
            </p>
            <p>Admitted 14 Mar 2026 · 04:18 · ICU 2</p>
          </div>

          <p className="hc-dossier__banner">Critical — multi-organ failure in progress</p>

          <h4 className="hc-dossier__label">Vitals now</h4>
          <ul className="hc-dossier__vitals">
            <li>
              HR <b>128</b>
            </li>
            <li>
              BP <b>78/42</b>
            </li>
            <li>
              SpO₂ <b>91%</b>
              <small>FiO₂ 0.80</small>
            </li>
            <li>
              Temp <b>38.9°C</b>
            </li>
          </ul>

          <h4 className="hc-dossier__label">Aligned findings</h4>
          <table className="hc-dossier__labs">
            <tbody>
              {REPORT_LABS.map((row) => (
                <tr key={row.name}>
                  <th>{row.name}</th>
                  <td>
                    <span className={`hc-dossier__flag is-${row.flag}`}>{row.value}</span>
                  </td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="hc-dossier__label">Citations</h4>
          <ul className="hc-dossier__cites">
            {REPORT_CITES.map((cite) => (
              <li key={cite.file}>
                <span>{cite.file}</span>
                <em>{cite.loc}</em>
              </li>
            ))}
          </ul>
        </section>

        <section className="hc-dossier__col hc-dossier__col--story" aria-label="Clinical course">
          <h4 className="hc-dossier__label">What happened</h4>
          <p>
            Ellison presented at 04:18 with sudden, severe abdominal pain out of proportion to
            exam, then collapsed in triage. CT angiography at 05:11 showed an occluding thrombus
            at the origin of the superior mesenteric artery — the vessel that supplies most of the
            small bowel. That occlusion is the root event. Everything after it follows from dying
            gut.
          </p>

          <h4 className="hc-dossier__label">What he is suffering</h4>
          <p>
            Necrotic ileum and jejunum released bacterial toxin into the blood. That produced{' '}
            <strong>septic shock</strong> (MAP 54 on norepinephrine), a lactate of 6.8 from
            ischemic tissue, and a pH of 7.21. The same hypoperfusion injured the kidneys —
            creatinine rose to 3.1 with almost no urine. He is not “just in pain.” He is in
            bowel-driven septic shock with acute kidney injury and worsening acidosis.
          </p>

          <h4 className="hc-dossier__label">Current condition</h4>
          <p>
            Taken for emergency laparotomy at 06:40: 140 cm of non-viable small bowel resected,
            abdomen left open for a second look. He is now intubated in ICU 2, anuric, still
            acidotic, and on rising pressor doses. Risk of further necrosis, anastomotic leak, and
            refractory shock remains high until the second-look confirms remaining bowel is viable.
          </p>
        </section>
      </div>
    </div>
  )
}

/** Soft curve from file → hub. Always progresses downward; no loops. */
function curveToHub(sx, sy, tx, ty) {
  const dy = Math.max(ty - sy, 24)
  const c1x = sx
  const c1y = sy + dy * 0.42
  const c2x = tx
  const c2y = ty - dy * 0.42
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${tx.toFixed(1)} ${ty.toFixed(1)}`
}

/** Soft curve branching left/right from the hub down to an outcome. */
function curveFork(sx, sy, tx, ty) {
  const dy = Math.max(ty - sy, 32)
  const c1x = sx
  const c1y = sy + dy * 0.35
  const c2x = tx
  const c2y = ty - dy * 0.35
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${tx.toFixed(1)} ${ty.toFixed(1)}`
}

export default function HealthcarePage() {
  const stageRef = useRef(null)
  const fieldRef = useRef(null)
  const targetRef = useRef(null)
  const leftOutRef = useRef(null)
  const rightOutRef = useRef(null)
  const leftForkRef = useRef(null)
  const rightForkRef = useRef(null)
  const docRefs = useRef([])
  const svgRef = useRef(null)
  const pathRefs = useRef([])
  const flowRefs = useRef([])
  const flowAnims = useRef([])
  const askRef = useRef(null)
  const simRef = useRef(null)
  const portRef = useRef(null)
  const scannerRef = useRef(null)
  const linkRef = useRef(null)
  const iqboxRef = useRef(null)
  const keepPortRef = useRef(null)
  const reportPortRef = useRef(null)
  const trunkRef = useRef(null)
  const [wireSize, setWireSize] = useState({ width: 0, height: 0 })
  const [forkHot, setForkHot] = useState(null)
  const { phase, typed, caretOn, start, completeScan } = useAskSimulation()
  const completeScanRef = useRef(completeScan)
  completeScanRef.current = completeScan
  const discardRef = useRef(null)
  const keepRef = useRef(null)
  const reportRef = useRef(null)
  const stackCardRefs = useRef([])
  const flyCardRefs = useRef([])
  const fileAnims = useRef([])
  const fileRun = useRef(0)
  const [goneStack, setGoneStack] = useState(() => new Set())
  const [kept, setKept] = useState([])

  useEffect(() => {
    const el = askRef.current
    if (!el) return undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start()
      },
      { threshold: 0.4, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [start])

  useEffect(() => {
    if (phase !== 'ready') return undefined

    const visible = (el) => {
      if (!el) return false
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || 0
      return r.bottom > 80 && r.top < vh - 24
    }

    if (
      !visible(scannerRef.current) &&
      !visible(keepRef.current) &&
      !visible(discardRef.current)
    ) {
      return undefined
    }

    const report = reportRef.current
    if (!report) return undefined

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const id = window.setTimeout(() => {
      report.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      })
    }, 80)

    return () => window.clearTimeout(id)
  }, [phase])

  useLayoutEffect(() => {
    const sim = simRef.current
    const port = portRef.current
    const scanner = scannerRef.current
    const link = linkRef.current
    if (!sim || !port || !scanner || !link) return undefined

    const connect = () => {
      const simBox = sim.getBoundingClientRect()
      const portBox = port.getBoundingClientRect()
      const scanBox = scanner.getBoundingClientRect()
      const top = Math.max(portBox.bottom - simBox.top, 0)
      const height = Math.max(scanBox.top - portBox.bottom + 2, 24)
      link.style.top = `${top}px`
      link.style.height = `${height}px`
    }

    connect()
    const ro = new ResizeObserver(connect)
    ro.observe(sim)
    ro.observe(port)
    ro.observe(scanner)
    window.addEventListener('resize', connect)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', connect)
    }
  }, [])

  useLayoutEffect(() => {
    const box = iqboxRef.current
    const from = keepPortRef.current
    const to = reportPortRef.current
    const trunk = trunkRef.current
    if (!box || !from || !to || !trunk) return undefined

    const paint = () => {
      const origin = box.getBoundingClientRect()
      const a = from.getBoundingClientRect()
      const b = to.getBoundingClientRect()
      const x1 = a.left + a.width / 2 - origin.left
      const y1 = a.bottom - origin.top
      const x2 = b.left + b.width / 2 - origin.left
      const y2 = b.top - origin.top
      const midY = y1 + Math.max((y2 - y1) * 0.48, 28)
      trunk.setAttribute(
        'd',
        `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x1.toFixed(1)} ${midY.toFixed(1)} L ${x2.toFixed(1)} ${midY.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`,
      )
      const svg = trunk.ownerSVGElement
      if (svg) {
        svg.setAttribute('viewBox', `0 0 ${origin.width} ${origin.height}`)
        svg.setAttribute('width', String(origin.width))
        svg.setAttribute('height', String(origin.height))
      }
    }

    paint()
    const ro = new ResizeObserver(paint)
    ro.observe(box)
    ro.observe(from)
    ro.observe(to)
    window.addEventListener('resize', paint)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', paint)
    }
  }, [phase, kept.length])

  useEffect(() => {
    if (phase === 'idle' || phase === 'typing') {
      fileRun.current += 1
      fileAnims.current.forEach((anim) => anim?.cancel())
      fileAnims.current = []
      setGoneStack(new Set())
      setKept([])
      flyCardRefs.current.forEach((el) => {
        if (!el) return
        el.getAnimations?.().forEach((anim) => anim.cancel())
        el.classList.remove('is-live', 'is-green', 'is-red')
        el.style.cssText = ''
      })
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'scan') return undefined

    const sim = simRef.current
    const scanner = scannerRef.current
    const keep = keepRef.current
    const discard = discardRef.current
    if (!sim || !scanner || !keep || !discard) {
      completeScanRef.current()
      return undefined
    }

    const runId = ++fileRun.current
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let keepCount = 0
    const live = () => runId === fileRun.current

    const resetFlyer = (el) => {
      if (!el) return
      el.getAnimations?.().forEach((anim) => anim.cancel())
      el.classList.remove('is-live', 'is-green', 'is-red')
      el.style.cssText = ''
    }

    const run = async () => {
      if (reduced) {
        const greens = []
        for (let fly = 0; fly < STACK_COUNT; fly += 1) {
          if (GREEN_FLY.has(fly)) greens.push(STACK_COUNT - 1 - fly)
        }
        setGoneStack(new Set(Array.from({ length: STACK_COUNT }, (_, i) => i)))
        setKept(greens)
        if (live()) completeScanRef.current()
        return
      }

      const order = Array.from({ length: STACK_COUNT }, (_, fly) => STACK_COUNT - 1 - fly)
      const sortJobs = []

      for (let flyIndex = 0; flyIndex < order.length; flyIndex += 1) {
        if (!live()) return

        const stackIndex = order[flyIndex]
        const origin = sim.getBoundingClientRect()
        const stackEl = stackCardRefs.current[stackIndex]
        const flyer = flyCardRefs.current[stackIndex]
        if (!stackEl || !flyer) continue

        const from = relBox(stackEl, origin)
        const scan = relBox(scanner, origin)
        const keepBox = relBox(keep, origin)
        const dump = relBox(discard, origin)
        const green = GREEN_FLY.has(flyIndex)

        setGoneStack((prev) => {
          const next = new Set(prev)
          next.add(stackIndex)
          return next
        })

        resetFlyer(flyer)
        flyer.classList.add('is-live')
        flyer.style.width = `${from.w}px`
        flyer.style.height = `${from.h}px`
        flyer.style.zIndex = '6'
        flyer.style.transform = `translate(${from.x}px, ${from.y}px)`

        const y = scan.y + scan.h / 2 - from.h / 2
        const enterX = scan.x + scan.w + 14
        const exitX = scan.x - from.w - 14

        const toEnter = flyer.animate(
          [
            { transform: `translate(${from.x}px, ${from.y}px) scale(1)` },
            { transform: `translate(${enterX}px, ${y}px) scale(1)` },
          ],
          { duration: 720, easing: EASE_FLY, fill: 'forwards' },
        )
        fileAnims.current.push(toEnter)
        await toEnter.finished.catch(() => {})
        if (!live()) return

        flyer.style.zIndex = '0'
        const through = flyer.animate(
          [
            { transform: `translate(${enterX}px, ${y}px) scale(1)`, opacity: 1 },
            {
              transform: `translate(${scan.x + scan.w / 2 - from.w / 2}px, ${y}px) scale(0.96)`,
              opacity: 1,
              offset: 0.5,
            },
            { transform: `translate(${exitX}px, ${y}px) scale(1)`, opacity: 1 },
          ],
          { duration: 760, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'forwards' },
        )
        fileAnims.current.push(through)
        window.setTimeout(() => {
          if (live()) flyer.classList.add(green ? 'is-green' : 'is-red')
        }, 420)
        await through.finished.catch(() => {})
        if (!live()) return

        flyer.style.zIndex = '6'

        const sortJob = (async () => {
          if (green) {
            const slot = keepCount
            keepCount += 1
            const pad = keepBox.w * 0.07
            const gap = keepBox.w * 0.06
            const cell = (keepBox.w - pad * 2 - gap) / 2
            const col = slot % 2
            const row = Math.floor(slot / 2)
            const destX = keepBox.x + pad + col * (cell + gap)
            const destY = keepBox.y + pad + row * (cell + gap)
            const s = cell / from.w

            const toKeep = flyer.animate(
              [
                { transform: `translate(${exitX}px, ${y}px) scale(1)` },
                { transform: `translate(${destX}px, ${destY}px) scale(${s})` },
              ],
              { duration: 720, easing: EASE_FLY, fill: 'forwards' },
            )
            fileAnims.current.push(toKeep)
            await toKeep.finished.catch(() => {})
            if (!live()) return
            resetFlyer(flyer)
            setKept((prev) => (prev.includes(stackIndex) ? prev : [...prev, stackIndex]))
            return
          }

          const destX = dump.x + dump.w / 2
          const destY = dump.y + dump.h / 2
          const midDumpX = (exitX + destX) / 2
          const midDumpY = (y + destY) / 2

          const toDump = flyer.animate(
            [
              {
                transform: `translate(${exitX}px, ${y}px) scale(1)`,
                opacity: 1,
              },
              {
                transform: `translate(${midDumpX}px, ${midDumpY}px) scale(0.38)`,
                opacity: 1,
                offset: 0.55,
              },
              {
                transform: `translate(${destX}px, ${destY}px) scale(0.14)`,
                opacity: 0.85,
                offset: 0.84,
              },
              {
                transform: `translate(${destX}px, ${destY}px) scale(0.02)`,
                opacity: 0,
              },
            ],
            { duration: 1080, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' },
          )
          fileAnims.current.push(toDump)
          await toDump.finished.catch(() => {})
          if (!live()) return
          resetFlyer(flyer)
        })()

        sortJobs.push(sortJob)
      }

      await Promise.all(sortJobs)
      if (live()) completeScanRef.current()
    }

    run()
    return () => {
      fileRun.current += 1
      fileAnims.current.forEach((anim) => anim?.cancel())
      fileAnims.current = []
    }
  }, [phase])

  useLayoutEffect(() => {
    const stage = stageRef.current
    const target = targetRef.current
    const svg = svgRef.current
    if (!stage || !target || !svg) return undefined

    let raf = 0
    let lastW = 0
    let lastH = 0

    /*
     * Per file: blue line appears as a dot → expands → draws full path to the
     * box → shrinks into the box → waits 3s → repeats.
     */
    const restartFlows = () => {
      flowRefs.current.forEach((flow, i) => {
        if (!flow) return
        let len = 0
        try {
          len = flow.getTotalLength()
        } catch {
          return
        }
        if (len < 8) return

        flowAnims.current[i]?.cancel()
        flow.style.strokeDasharray = `${len} ${len}`
        flow.style.strokeDashoffset = String(len)
        flow.style.strokeWidth = '0'
        flow.style.opacity = '0'

        const growEnd = 0.4
        const holdEnd = 0.48
        const shrinkEnd = 0.62
        /* Remaining ~38% of the cycle ≈ 3s wait when duration is 7800ms */
        const duration = 7800

        flowAnims.current[i] = flow.animate(
          [
            {
              offset: 0,
              strokeDashoffset: len,
              strokeWidth: 0,
              opacity: 0,
            },
            {
              offset: 0.03,
              strokeDashoffset: len - 2,
              strokeWidth: 1.1,
              opacity: 1,
            },
            {
              offset: 0.07,
              strokeDashoffset: len - 2,
              strokeWidth: 2.6,
              opacity: 1,
            },
            {
              offset: growEnd,
              strokeDashoffset: 0,
              strokeWidth: 2.6,
              opacity: 1,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            {
              offset: holdEnd,
              strokeDashoffset: 0,
              strokeWidth: 2.6,
              opacity: 1,
            },
            {
              offset: shrinkEnd,
              strokeDashoffset: -len,
              strokeWidth: 2.2,
              opacity: 1,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            {
              offset: shrinkEnd + 0.02,
              strokeDashoffset: -len,
              strokeWidth: 0,
              opacity: 0,
            },
            {
              offset: 1,
              strokeDashoffset: len,
              strokeWidth: 0,
              opacity: 0,
            },
          ],
          {
            duration,
            delay: (i % 6) * 220,
            iterations: Infinity,
            easing: 'linear',
            fill: 'forwards',
          },
        )
      })
    }

    const paint = () => {
      const stageBox = stage.getBoundingClientRect()
      const targetBox = target.getBoundingClientRect()
      const width = stageBox.width
      const height = stageBox.height

      if (width >= 8 && height >= 8) {
        let resized = false
        if (width !== lastW || height !== lastH) {
          lastW = width
          lastH = height
          resized = true
          setWireSize({ width, height })
          svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
        }

        const hubX = targetBox.left + targetBox.width / 2 - stageBox.left
        const hubInY = targetBox.top - stageBox.top + 0.5
        const hubOutY = targetBox.bottom - stageBox.top - 0.5

        docRefs.current.forEach((el, i) => {
          const path = pathRefs.current[i]
          const flow = flowRefs.current[i]
          if (!el || !path) return
          const box = el.getBoundingClientRect()
          const sx = box.left + box.width / 2 - stageBox.left
          /* Tuck 2px under the card edge so the join never shows a gap */
          const sy = box.bottom - stageBox.top - 2
          const d = curveToHub(sx, sy, hubX, hubInY)
          path.setAttribute('d', d)
          if (flow) flow.setAttribute('d', d)
        })

        if (resized) restartFlows()

        const left = leftOutRef.current
        const right = rightOutRef.current
        if (left && leftForkRef.current) {
          const box = left.getBoundingClientRect()
          const tx = box.left + box.width / 2 - stageBox.left
          const ty = box.top - stageBox.top
          leftForkRef.current.setAttribute('d', curveFork(hubX, hubOutY, tx, ty))
        }
        if (right && rightForkRef.current) {
          const box = right.getBoundingClientRect()
          const tx = box.left + box.width / 2 - stageBox.left
          const ty = box.top - stageBox.top
          rightForkRef.current.setAttribute('d', curveFork(hubX, hubOutY, tx, ty))
        }
      }

      raf = requestAnimationFrame(paint)
    }

    raf = requestAnimationFrame(paint)
    /* Kick flow anims once paths exist */
    const boot = requestAnimationFrame(() => {
      requestAnimationFrame(restartFlows)
    })

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(boot)
      flowAnims.current.forEach((anim) => anim?.cancel())
      flowAnims.current = []
    }
  }, [])

  return (
    <main className="hc">
      <section className="hc-hero" aria-labelledby="hc-hero-title">
        <div className="hc-hero__field" aria-hidden="true" />

        <div className="hc-hero__inner">
          <p className="hc-hero__badge" style={{ '--i': 0 }}>
            <span className="hc-hero__mark" aria-hidden="true" />
            Built for healthcare. Designed for trust.
          </p>

          <h1 className="hc-hero__title" id="hc-hero-title" style={{ '--i': 1 }}>
            Isn&rsquo;t It <mark className="hc-hero__highlight">Obvious?</mark>
          </h1>

          <div className="hc-hero__story" style={{ '--i': 2 }}>
            <p>Just imagine... a patient is in critical condition.</p>
            <p>
              A new doctor takes over the case and needs to understand the patient's history quickly.
            </p>
            <p>
              Their history is sitting across records, reports, scans, notes, and documents.
              Now someone has to find it all, put it together, read through it,{' '}
              <span className="hc-hero__chip">summarize</span> it, and{' '}
              <span className="hc-hero__chip">figure out</span> what matters.
            </p>
            <p>And they need to do all of that while the clock is already running.</p>
          </div>

          <div className="hc-hero__after" style={{ '--i': 3 }}>
            <p className="hc-hero__exhaust">
              Wouldn&rsquo;t that be <mark className="hc-hero__highlight">Overwhelming?</mark>
            </p>
            <p>Especially when every minute and every decision matters.</p>
          </div>

          <div className="hc-hero__punch" style={{ '--i': 4 }}>
            <p className="hc-hero__punch-line">Yes. The obvious answer is AI.</p>
            <p className="hc-hero__punch-sub">
              <mark className="hc-hero__punch-mark">But at what cost?</mark>
            </p>
          </div>
        </div>
      </section>

      <SectionSep />

      <section className="hc-scatter" aria-labelledby="hc-scatter-title">
        <div className="hc-scatter__inner">
          <h2 className="hc-scatter__title" id="hc-scatter-title">
            The <mark className="hc-hero__highlight">Scattered Data</mark>
          </h2>

          <div className="hc-scatter__stage" ref={stageRef}>
            <svg
              ref={svgRef}
              className="hc-scatter__wires"
              width={wireSize.width || '100%'}
              height={wireSize.height || '100%'}
              viewBox={
                wireSize.width && wireSize.height
                  ? `0 0 ${wireSize.width} ${wireSize.height}`
                  : '0 0 100 100'
              }
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {SCATTER_DOCS.map((_, i) => (
                <path
                  key={`wire-${i}`}
                  className="hc-scatter__wire"
                  ref={(el) => {
                    pathRefs.current[i] = el
                  }}
                />
              ))}
              {SCATTER_DOCS.map((_, i) => (
                <path
                  key={`flow-${i}`}
                  className="hc-scatter__wire-flow"
                  ref={(el) => {
                    flowRefs.current[i] = el
                  }}
                />
              ))}
              <path
                className={`hc-scatter__wire hc-scatter__wire--fork${forkHot === 'left' ? ' is-hot' : ''}`}
                ref={leftForkRef}
              />
              <path
                className={`hc-scatter__wire hc-scatter__wire--fork${forkHot === 'right' ? ' is-hot' : ''}`}
                ref={rightForkRef}
              />
            </svg>

            <div className="hc-scatter__field" ref={fieldRef} aria-hidden="true">
              {SCATTER_DOCS.map((doc, i) => (
                <ScatterDoc
                  key={i}
                  {...doc}
                  docRef={(el) => {
                    docRefs.current[i] = el
                  }}
                />
              ))}
            </div>

            <div className="hc-scatter__target" ref={targetRef}>
              Needs to be processed
            </div>

            <div className="hc-scatter__fork">
              <p
                className={`hc-scatter__outcome${forkHot === 'left' ? ' is-hot' : ''}`}
                ref={leftOutRef}
                onMouseEnter={() => setForkHot('left')}
                onMouseLeave={() => setForkHot(null)}
              >
                Use Cloud AI — and risk exposing your patients&rsquo; private, personal details,{' '}
                <mark className="hc-hero__highlight">breaking their privacy.</mark>
              </p>
              <p
                className={`hc-scatter__outcome${forkHot === 'right' ? ' is-hot' : ''}`}
                ref={rightOutRef}
                onMouseEnter={() => setForkHot('right')}
                onMouseLeave={() => setForkHot(null)}
              >
                Stay with the manual overhead — delay the process, and{' '}
                <mark className="hc-hero__highlight">risk your patient&rsquo;s life.</mark>
              </p>
            </div>
          </div>

          <p className="hc-scatter__reassure">Don&rsquo;t worry</p>
        </div>
      </section>

      <SectionSep />

      <section
        className="hc-iqbox"
        aria-labelledby="hc-iqbox-title"
        data-phase={phase}
        ref={iqboxRef}
      >
        <div className="hc-iqbox__inner">
          <h2 className="hc-iqbox__title" id="hc-iqbox-title">
            Introducing <mark className="hc-hero__highlight">IQ Box</mark>
          </h2>
          <p className="hc-iqbox__caption">AI that runs on your own infrastructure</p>
        </div>

        <div className="hc-iqbox__sim" ref={simRef}>
            <div
              className="hc-ask"
              ref={askRef}
              role="img"
              aria-label="Simulated question sent into IQ Box"
            >
              <div className="hc-ask__box">
                <div className={`hc-ask__input${typed || caretOn ? ' is-live' : ''}`}>
                  <PinGlyph />
                  {typed || caretOn ? (
                    <span className="hc-ask__typed">
                      {typed}
                      {caretOn && <i className="hc-ask__caret" />}
                    </span>
                  ) : (
                    <span className="hc-ask__placeholder">
                      What&rsquo;s on your mind today?
                    </span>
                  )}
                </div>
                <div className={`hc-ask__send${phase === 'press' ? ' is-press' : ''}`}>
                  {phase !== 'plane' && <PlaneGlyph />}
                  {phase === 'plane' && (
                    <>
                      <span className="hc-ask__plane-fly">
                        <PlaneGlyph />
                      </span>
                      <span className="hc-ask__plane-enter">
                        <PlaneGlyph />
                      </span>
                    </>
                  )}
                </div>
              </div>

              <span className="hc-ask__port" ref={portRef} aria-hidden="true">
                <span className="hc-ask__port-dot" />
              </span>
            </div>

              <span className="hc-ask__link" ref={linkRef} aria-hidden="true">
                <span className="hc-ask__link-base" />
                <span className="hc-ask__link-fill" />
                <span className="hc-ask__link-dot">
                  <i />
                </span>
              </span>

            <div className="hc-iqbox__stage">
              <div className="hc-bins" aria-hidden="true">
                <div className="hc-bins__discard">
                  <span className="hc-bins__label">Discard</span>
                  <div
                    className="hc-bins__slot hc-bins__slot--discard"
                    ref={discardRef}
                  />
                </div>
                <div className="hc-bins__keep">
                  <div className="hc-bins__slot hc-bins__slot--keep" ref={keepRef}>
                    {kept.map((id, i) => (
                      <div
                        key={id}
                        className="hc-keep-card"
                        style={{ '--k': i }}
                      >
                        <DocFace />
                      </div>
                    ))}
                  </div>
                  <div
                    className={`hc-bins__report${
                      kept.length > 0 || phase === 'report' ? ' is-on' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <span className="hc-bins__port" ref={keepPortRef}>
                      <span className="hc-bins__port-dot" />
                    </span>
                    {phase === 'report' ? (
                      <span className="hc-bins__status">
                        <span className="hc-bins__report-text">Generating report</span>
                        <span className="hc-bins__spinner" />
                      </span>
                    ) : kept.length > 0 && phase !== 'ready' ? (
                      <span className="hc-bins__status">
                        <span className="hc-bins__process-text">Processing</span>
                        <span className="hc-bins__spinner" />
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="hc-scanner" ref={scannerRef} aria-hidden="true">
                <div className="hc-scanner__body">
                  <div className="hc-scanner__shadows">
                    <span className="hc-scanner__shadow hc-scanner__shadow--left" />
                    <span className="hc-scanner__shadow hc-scanner__shadow--right" />
                  </div>
                  <div className="hc-scanner__face">
                    <div className="hc-scanner__slot">
                      <span className="hc-scanner__dot" />
                      <span className="hc-scanner__dot" />
                    </div>
                  </div>
                </div>
                {(phase === 'scan' || phase === 'scanning') && (
                  <div className="hc-scanner__word">
                    {'SCANNING'.split('').map((ch, i) => (
                      <span key={`${ch}-${i}`}>{ch}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="hc-stack" aria-hidden="true">
                {Array.from({ length: STACK_COUNT }, (_, i) => (
                  <div
                    key={i}
                    className={`hc-stack__card${goneStack.has(i) ? ' is-gone' : ''}`}
                    style={{ '--i': i }}
                    ref={(el) => {
                      stackCardRefs.current[i] = el
                    }}
                  >
                    <DocFace />
                  </div>
                ))}
              </div>
            </div>

              <div className="hc-fly" aria-hidden="true">
                {Array.from({ length: STACK_COUNT }, (_, i) => (
                  <div
                    key={i}
                    className="hc-fly__card"
                    ref={(el) => {
                      flyCardRefs.current[i] = el
                    }}
                  >
                    <DocFace />
                  </div>
                ))}
              </div>
          </div>

        <div className="hc-report" id="hc-report" ref={reportRef}>
          <span className="hc-report__port" ref={reportPortRef} aria-hidden="true">
            <span className="hc-report__port-dot" />
          </span>
          <div
            className={`hc-report__sheet${phase === 'ready' ? ' is-ready' : ''}`}
            aria-labelledby="hc-report-title"
          >
            {phase === 'ready' ? (
              <PatientReport />
            ) : (
              <>
                <h3 className="hc-report__title" id="hc-report-title">
                  Patient report
                </h3>
                <p className="hc-report__body">Waiting for IQ Box to finish scanning.</p>
              </>
            )}
          </div>
        </div>
        <p className="hc-report__belief">
          We Believe &ldquo;The Patient&rsquo;s Data Should Never Be the Price of Better
          AI.&rdquo;
        </p>
        <svg className="hc-iqbox__elbow" aria-hidden="true">
          <path
            ref={trunkRef}
            className={`hc-iqbox__elbow-line${
              phase === 'report' || phase === 'ready' ? ' is-on' : ''
            }`}
          />
        </svg>
      </section>

      <SectionSep />

      <section className="hc-more" aria-labelledby="hc-more-title">
        <div className="hc-more__inner">
          <h2 className="hc-more__title" id="hc-more-title">
            This is <mark className="hc-hero__highlight">Not The End</mark>
          </h2>
          <p className="hc-more__caption">
            The OfflineIQ comes with various features
          </p>

          <div className="hc-more__grid">
            <article className="hc-more__card">
              <h3 className="hc-more__card-title">
                <span className="hc-more__num" aria-hidden="true">
                  1
                </span>
                <span>13 Specialized AI Agents</span>
              </h3>
              <p className="hc-more__card-body">
                Handle everyday healthcare workflows—from clinical review and extraction to
                validation, redaction, and reporting.
              </p>
            </article>
            <article className="hc-more__card">
              <h3 className="hc-more__card-title">
                <span className="hc-more__num" aria-hidden="true">
                  2
                </span>
                <span>Connect Your Data</span>
              </h3>
              <p className="hc-more__card-body">
                Connect your existing records, databases, documents, and internal sources
                directly inside your environment.
              </p>
            </article>
          </div>

          <ul className="hc-more__traits" aria-label="OfflineIQ guarantees">
            {[
              'No external APIs',
              'No cloud model fallback',
              'Zero egress',
              'Role-based access',
              'Audit logging',
              'Encryption',
            ].map((label) => (
              <li key={label} className="hc-more__trait">
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Shell>
        <SectionSep />
        <Contact
          heading={
            <>
              <mark className="contact__mark">One Step</mark> Closer to Healthcare You Can
              Trust
            </>
          }
        />
      </Shell>
    </main>
  )
}
