import { useCallback, useEffect, useRef, useState } from 'react'

/* Source order also fixes the blink order and the `--i` stagger index. */
export const SIM_SOURCES = ['pdf', 'docx', 'xlsx', 'pptx', 'image', 'text', 'db']

/*
 * Five static field scenarios. Greens, filenames and accuracy are fixed per
 * scenario. The loop walks 0 → 4 → 0 … and resumes the same index after pause.
 */
export const SIM_SCENARIOS = [
  {
    id: 'healthcare',
    question: 'Which protocols changed in the ICU sepsis pathway?',
    reply:
      'Fluid resuscitation targets were raised, and two antibiotic timing windows were shortened.',
    accuracy: 94,
    greens: ['pdf', 'docx', 'text'],
    files: {
      pdf: 'icu-sepsis-protocol-2024.pdf',
      docx: 'clinical-pathway-revision.docx',
      xlsx: 'ward-occupancy-q2.xlsx',
      pptx: 'nursing-handoff-brief.pptx',
      image: 'monitor-waveform-scan.png',
      text: 'emr-order-set-notes.md',
      db: 'ehr.care_pathways',
    },
  },
  {
    id: 'business',
    question: 'What changed in the vendor contract?',
    reply:
      'Payment terms moved from 30 to 45 days, and two liability clauses were revised.',
    accuracy: 91,
    greens: ['pdf', 'docx', 'pptx'],
    files: {
      pdf: 'vendor-agreement-2024.pdf',
      docx: 'contract-amendments-v3.docx',
      xlsx: 'vendor-pricing-schedule.xlsx',
      pptx: 'procurement-review-q3.pptx',
      image: 'signature-page-scan.png',
      text: 'contract-redline-notes.md',
      db: 'erp.vendor_contracts',
    },
  },
  {
    id: 'legal',
    question: 'Summarise the open discovery risks in the Acme matter.',
    reply:
      'Privilege logs are incomplete on 14 emails, and two custodians remain uncollected.',
    accuracy: 96,
    greens: ['pdf', 'docx', 'text', 'db'],
    files: {
      pdf: 'acme-discovery-order.pdf',
      docx: 'privilege-log-draft.docx',
      xlsx: 'custodian-tracker.xlsx',
      pptx: 'litigation-status-deck.pptx',
      image: 'exhibit-b-scan.png',
      text: 'counsel-strategy-notes.md',
      db: 'matters.acme_docket',
    },
  },
  {
    id: 'finance',
    question: 'Why did Q3 operating margin miss the forecast?',
    reply:
      'Cloud spend overran by 11%, and two deferred-revenue reclassifications hit COGS.',
    accuracy: 89,
    greens: ['xlsx', 'pptx', 'pdf'],
    files: {
      pdf: 'q3-board-pack.pdf',
      docx: 'fpna-commentary.docx',
      xlsx: 'operating-expense-model.xlsx',
      pptx: 'earnings-prep-slides.pptx',
      image: 'ledger-screenshot.png',
      text: 'close-checklist.md',
      db: 'finance.gl_actuals',
    },
  },
  {
    id: 'government',
    question: 'Which clearance requirements apply to the border sensor RFP?',
    reply:
      'Secret clearance is mandatory for integrators, with two controlled-unclassified annexes.',
    accuracy: 93,
    greens: ['pdf', 'docx', 'db', 'text'],
    files: {
      pdf: 'border-sensor-rfp.pdf',
      docx: 'clearance-matrix.docx',
      xlsx: 'vendor-eval-scores.xlsx',
      pptx: 'program-overview.pptx',
      image: 'facility-badge-scan.png',
      text: 'cui-handling-notes.md',
      db: 'acq.solicitation_registry',
    },
  },
]

const CHAR_MS = 42
const BLINK_STAGGER = 200
const BLINK_ROUNDS = 1800
const LOOP_GAP_MS = 3000

function timingFor(question) {
  return {
    typing: question.length * CHAR_MS,
    settle: 460,
    press: 240,
    plane: 940,
    float: 460,
    request: 950,
    core: 260,
    fan: 780,
    caps: 260,
    blink: BLINK_STAGGER * (SIM_SOURCES.length - 1) + BLINK_ROUNDS,
    mark: 620,
    gather: 840,
    core2: 260,
    return: 950,
    reset: 400,
    reply: 420,
    hold: LOOP_GAP_MS,
  }
}

export const SIM_TIMING = timingFor(SIM_SCENARIOS[0].question)

export const BLINK_STAGGER_MS = BLINK_STAGGER

const CAPS_BLUE = new Set(['caps'])
const CAPS_BLINK = new Set(['blink'])
const CAPS_MARKED = new Set(['mark', 'gather', 'core2', 'return'])

export function capsModeFor(phase) {
  if (CAPS_BLUE.has(phase)) return 'blue'
  if (CAPS_BLINK.has(phase)) return 'blink'
  if (CAPS_MARKED.has(phase)) return 'marked'
  return 'default'
}

function nowLabel() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function useHowSimulation() {
  const [phase, setPhase] = useState('idle')
  const [typed, setTyped] = useState('')
  const [userMsg, setUserMsg] = useState(null)
  const [replyMsg, setReplyMsg] = useState(null)
  const [greens, setGreens] = useState([])
  const [files, setFiles] = useState([])
  const [accuracy, setAccuracy] = useState(0)

  const timers = useRef([])
  const typer = useRef(null)
  const running = useRef(false)
  const scenarioIndex = useRef(0)
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
    setUserMsg(null)
    setReplyMsg(null)
    setGreens([])
    setFiles([])
    setAccuracy(0)
  }, [])

  useEffect(
    () => () => {
      running.current = false
      clearTimers()
    },
    [clearTimers],
  )

  const runScenario = useCallback(
    (index) => {
      if (!running.current) return

      const id = ++runId.current
      clearTimers()
      clearBoard()

      const scenario = SIM_SCENARIOS[index]
      const timing = timingFor(scenario.question)
      const cited = scenario.greens.map((sid) => scenario.files[sid]).filter(Boolean)

      setGreens(scenario.greens)
      setFiles(cited)
      setAccuracy(scenario.accuracy)

      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

      if (reduced) {
        setUserMsg({ text: scenario.question, time: nowLabel() })
        setReplyMsg(scenario.reply)
        setPhase('done')
        timers.current.push(
          setTimeout(() => {
            if (!running.current || runId.current !== id) return
            scenarioIndex.current = (index + 1) % SIM_SCENARIOS.length
            clearBoard()
            timers.current.push(
              setTimeout(() => {
                if (running.current && runId.current === id) {
                  runScenario(scenarioIndex.current)
                }
              }, 80),
            )
          }, LOOP_GAP_MS),
        )
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
        setTyped(scenario.question.slice(0, i))
        if (i >= scenario.question.length && typer.current) {
          clearInterval(typer.current)
          typer.current = null
        }
      }, CHAR_MS)

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
      step('plane')
      step('float', () => {
        setUserMsg({ text: scenario.question, time: nowLabel() })
        setTyped('')
      })
      step('request')
      step('core')
      step('fan')
      step('caps')
      step('blink')
      step('mark')
      step('gather')
      step('core2')
      step('return')
      step('reset')
      step('reply', () => {
        setReplyMsg(scenario.reply)
      })
      step('done')
      /* Keep the finished reply on screen for LOOP_GAP_MS, then wipe and loop. */
      step('hold')

      timers.current.push(
        setTimeout(() => {
          if (!running.current || runId.current !== id) return
          scenarioIndex.current = (index + 1) % SIM_SCENARIOS.length
          clearBoard()
          timers.current.push(
            setTimeout(() => {
              if (running.current && runId.current === id) {
                runScenario(scenarioIndex.current)
              }
            }, 60),
          )
        }, cursor),
      )
    },
    [clearBoard, clearTimers],
  )

  const start = useCallback(() => {
    if (running.current) return
    running.current = true
    runScenario(scenarioIndex.current)
  }, [runScenario])

  const pause = useCallback(() => {
    if (!running.current) return
    running.current = false
    runId.current += 1
    clearTimers()
    clearBoard()
  }, [clearBoard, clearTimers])

  return {
    phase,
    typed,
    caretOn: phase === 'typing' || phase === 'settle',
    userMsg,
    replyMsg,
    greens,
    files,
    accuracy,
    start,
    pause,
  }
}
