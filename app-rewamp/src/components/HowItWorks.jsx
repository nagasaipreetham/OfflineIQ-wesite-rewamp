import { useEffect, useRef } from 'react'
import { ShellInner } from './Shell.jsx'
import IngestOrbit from './IngestOrbit.jsx'
import ChatSim from './ChatSim.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import {
  SIM_SOURCES,
  capsModeFor,
  useHowSimulation,
} from '../lib/useHowSimulation.js'
import './HowItWorks.css'

function HowItWorks() {
  const sectionRef = useRef(null)
  const {
    phase,
    typed,
    caretOn,
    userMsg,
    replyMsg,
    greens,
    accuracy,
    start,
  } = useHowSimulation()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start()
      },
      { threshold: 0.32, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [start])

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

  return (
    <section className="how" id="how-it-works" ref={sectionRef} data-phase={phase}>
      <ShellInner>
        <h2 className="how__title">
          <span className="how__num" aria-hidden="true">
            {greekNumeral(1)}.
          </span>
          <span className="how__label">How it works</span>
        </h2>
        <div className="how__rule" aria-hidden="true" />

        <div className="how__stack">
          <div className="how__panel how__panel--top">
            <div className="how__diagram">
              <IngestOrbit phase={phase} capsMode={capsModeFor(phase)} marks={marks} />

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
                greens={greens}
                accuracy={accuracy}
              />
            </div>
          </div>

          <div className="how__panel how__panel--bottom" />
        </div>
      </ShellInner>
    </section>
  )
}

export default HowItWorks
