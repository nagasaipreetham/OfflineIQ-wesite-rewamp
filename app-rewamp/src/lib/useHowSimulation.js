import { useCallback, useEffect, useRef, useState } from 'react'

/* Source order also fixes the blink order and the `--i` stagger index. */
export const SIM_SOURCES = ['pdf', 'docx', 'xlsx', 'pptx', 'image', 'text', 'db']

/* Each source owns a file whose name ties back to the question's subject. */
export const SIM_FILES = {
  pdf: 'vendor-agreement-2024.pdf',
  docx: 'contract-amendments-v3.docx',
  xlsx: 'vendor-pricing-schedule.xlsx',
  pptx: 'procurement-review-q3.pptx',
  image: 'signature-page-scan.png',
  text: 'contract-redline-notes.md',
  db: 'erp.vendor_contracts',
}

export const QUESTION = 'What changed in the vendor contract?'
export const REPLY =
  'Payment terms moved from 30 to 45 days, and two liability clauses were revised.'

const CHAR_MS = 42
const BLINK_STAGGER = 200
const BLINK_ROUNDS = 1800

/* Single source of truth: CSS reads the same numbers through custom props. */
export const SIM_TIMING = {
  typing: QUESTION.length * CHAR_MS,
  settle: 460,
  press: 240,
  plane: 940, // 600ms outbound + 340ms inbound replacement
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
}

export const BLINK_STAGGER_MS = BLINK_STAGGER

/* Phases where the ring's end caps read blue, blinking, or green/red. */
const CAPS_BLUE = new Set(['caps'])
const CAPS_BLINK = new Set(['blink'])
const CAPS_MARKED = new Set(['mark', 'gather', 'core2', 'return'])

export function capsModeFor(phase) {
  if (CAPS_BLUE.has(phase)) return 'blue'
  if (CAPS_BLINK.has(phase)) return 'blink'
  if (CAPS_MARKED.has(phase)) return 'marked'
  return 'default'
}

function pickGreens() {
  const count = Math.random() < 0.5 ? 3 : 4
  const pool = [...SIM_SOURCES]
  const picked = []
  while (picked.length < count && pool.length) {
    const [id] = pool.splice(Math.floor(Math.random() * pool.length), 1)
    picked.push(id)
  }
  /* keep ring order so the gather animation reads left-to-right */
  return SIM_SOURCES.filter((id) => picked.includes(id))
}

function pickAccuracy() {
  return 85 + Math.floor(Math.random() * 13) // 85–97
}

/* Local machine clock, as shown next to the sent message. */
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
  const [accuracy, setAccuracy] = useState(0)

  const timers = useRef([])
  const typer = useRef(null)
  const started = useRef(false)

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      if (typer.current) clearInterval(typer.current)
    },
    [],
  )

  const start = useCallback(() => {
    if (started.current) return
    started.current = true

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      setGreens(pickGreens())
      setAccuracy(pickAccuracy())
      setUserMsg({ text: QUESTION, time: nowLabel() })
      setReplyMsg(REPLY)
      setPhase('done')
      return
    }

    setPhase('typing')

    let i = 0
    typer.current = setInterval(() => {
      i += 1
      setTyped(QUESTION.slice(0, i))
      if (i >= QUESTION.length && typer.current) {
        clearInterval(typer.current)
        typer.current = null
      }
    }, CHAR_MS)

    let cursor = SIM_TIMING.typing
    const step = (name, onEnter) => {
      timers.current.push(
        setTimeout(() => {
          onEnter?.()
          setPhase(name)
        }, cursor),
      )
      cursor += SIM_TIMING[name] ?? 0
    }

    step('settle')
    step('press')
    step('plane')
    step('float', () => {
      setUserMsg({ text: QUESTION, time: nowLabel() })
      setTyped('')
    })
    step('request')
    step('core')
    step('fan')
    step('caps')
    step('blink')
    step('mark', () => setGreens(pickGreens()))
    step('gather')
    step('core2')
    step('return')
    step('reset')
    step('reply', () => {
      setReplyMsg(REPLY)
      setAccuracy(pickAccuracy())
    })
    step('done')
  }, [])

  return {
    phase,
    typed,
    caretOn: phase === 'typing' || phase === 'settle',
    userMsg,
    replyMsg,
    greens,
    accuracy,
    start,
  }
}
