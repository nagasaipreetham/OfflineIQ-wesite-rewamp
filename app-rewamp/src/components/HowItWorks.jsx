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

const POINTS = [
  'Every document Fort Knox ingests becomes part of a private model of how the company actually operates. Not a generic assistant bolted onto a file share. A structured, queryable model built entirely from your own corpus, and it never leaves the building it was built in.',
  'Ask it a question in plain language. It answers grounded in your documents, cited back to source, down to the clause it came from. It isn\u2019t answering from the internet. It doesn\u2019t know the internet exists.',
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
            <span className="how__label">The Digital Twin</span>
          </h2>
          <div className="how__rule" aria-hidden="true" />
        </SectionPin>

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
              {POINTS.map((text, i) => (
                <article key={i} className="how__step">
                  <span className="how__step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <p className="how__step-body">{text}</p>
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
