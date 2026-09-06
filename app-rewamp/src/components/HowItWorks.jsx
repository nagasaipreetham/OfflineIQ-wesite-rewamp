import { useEffect, useRef, useState } from 'react'
import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import IngestOrbit from './IngestOrbit.jsx'
import ChatSim from './ChatSim.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import {
  SIM_SOURCES,
  capsModeFor,
  useHowSimulation,
} from '../lib/useHowSimulation.js'
import './HowItWorks.css'

const STACK_MQ = '(max-width: 900px)'

const PIPELINE_STEPS = [
  {
    title: 'Connect to internal files',
    body: 'OfflineIQ connects to approved document stores, exports, and file shares within your environment.',
  },
  {
    title: 'Organize documents for private search',
    body: 'Parsing, OCR, permissions, metadata, and embeddings prepare your files for fast, permission-aware internal search.',
  },
  {
    title: 'Find the right evidence',
    body: 'The system retrieves the most relevant document sections before the AI drafts a response.',
  },
  {
    title: 'Draft from approved material',
    body: 'The model runs entirely within the client environment and uses retrieved internal material to generate the draft.',
  },
  {
    title: 'Show the source',
    body: 'Source, section, page, and chunk details are attached to each response so reviewers can verify the underlying evidence.',
  },
  {
    title: 'Keep humans in control',
    body: 'OfflineIQ produces drafts and extracts for review. It does not automatically send or execute work in external systems.',
  },
]

function HowItWorks() {
  const sectionRef = useRef(null)
  const [stacked, setStacked] = useState(false)
  const {
    phase,
    typed,
    caretOn,
    userMsg,
    replyMsg,
    greens,
    files,
    accuracy,
    start,
    pause,
  } = useHowSimulation()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start()
        else pause()
      },
      { threshold: 0.32, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [start, pause])

  useEffect(() => {
    const mq = window.matchMedia(STACK_MQ)
    const sync = () => setStacked(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const marks = {}
  if (
    phase === 'mark' ||
    phase === 'gather' ||
    phase === 'core2' ||
    phase === 'return'
  ) {
    for (const id of SIM_SOURCES) {
      marks[id] = greens.includes(id) ? 'green' : 'red'
    }
  }

  /* Stacked: south feeds the chat, XLSX sits east. Row: east feeds the chat. */
  const outlet = stacked ? 'south' : 'east'

  return (
    <section
      className="how"
      id="how-it-works"
      ref={sectionRef}
      data-phase={phase}
      data-layout={stacked ? 'stack' : 'row'}
    >
      <ShellInner>
        <SectionPin>
          <h2 className="how__title">
            <span className="how__num" aria-hidden="true">
              {greekNumeral(1)}.
            </span>
            <span className="how__label">How it works</span>
          </h2>
          <div className="how__rule" aria-hidden="true" />
        </SectionPin>

        <div className="how__intro">
          <h3 className="how__heading">
            How <mark className="how__mark">OfflineIQ</mark> works.
          </h3>
          <p className="how__caption">
            A six-stage pipeline that turns your private document corpus into cited,
            sourced work — without a single byte leaving your network.
          </p>
        </div>

        <div className="how__stack">
          <div className="how__panel how__panel--top">
            <div className="how__diagram">
              <IngestOrbit
                phase={phase}
                capsMode={capsModeFor(phase)}
                marks={marks}
                outlet={outlet}
              />

              <span className="how__link" aria-hidden="true">
                <span className="how__link-base" />
                <span className="how__link-fill how__link-fill--blue" />
                <span className="how__link-fill how__link-fill--green" />
                <span className="how__link-dot">
                  <i />
                </span>
              </span>

              <span className="how__port" aria-hidden="true">
                <span className="how__port-dot" />
              </span>

              <ChatSim
                phase={phase}
                typed={typed}
                caretOn={caretOn}
                userMsg={userMsg}
                replyMsg={replyMsg}
                files={files}
                accuracy={accuracy}
              />
            </div>
          </div>

          <div className="how__panel how__panel--bottom">
            <div className="how__steps">
              {PIPELINE_STEPS.map((step, i) => (
                <article key={step.title} className="how__step">
                  <h4 className="how__step-title">
                    <span className="how__step-num" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="how__step-label">{step.title}</span>
                  </h4>
                  <p className="how__step-body">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </ShellInner>
    </section>
  )
}

export default HowItWorks
