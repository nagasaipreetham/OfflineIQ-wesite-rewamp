import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Shell, { ShellInner } from '../components/Shell.jsx'
import SectionSep from '../components/SectionSep.jsx'
import SectionPin from '../components/SectionPin.jsx'
import Contact from '../components/Contact.jsx'
import { ArrowRight, SplitCta } from '../components/Button.jsx'
import { usePageMeta } from '../lib/usePageMeta.js'
import './ContentJourneyPage.css'

const TITLE = 'Content Journey | Answers You Can Defend | OfflineIQ'
const DESCRIPTION =
  'Six capabilities that separate professional-grade private AI from generic search-with-a-chat-window \u2014 each built around risk, evidence, and accountability.'
const KEYWORDS =
  'private AI content journey, document authority, trust score, clause-level citations'

const PARTS = [
  {
    id: 'part-01',
    num: '01',
    side: 'left',
    kicker: 'Part 01',
    heading: (
      <>
        Your AI knows which documents <mark className="cj-mark">matter most</mark>
      </>
    ),
    quote: 'Precision stays constant. Speed stays constant. The system gets sharper the longer you use it.',
    points: [
      'Most AI systems search your entire document corpus on every query \u2014 treating a five-year-old archived memo with the same weight as your most critical active contracts. As your corpus grows, so does the noise.',
      'OfflineIQ\u2019s proprietary indexing engine continuously analyses your organisation\u2019s document landscape and automatically prioritises what matters.',
      'The system builds a living map of your knowledge \u2014 learning which documents your team relies on, which are peripheral, and which are archived \u2014 and structurally organises retrieval around that hierarchy.',
      'Precision stays constant. Speed stays constant. The system gets sharper the longer you use it.',
    ],
  },
  {
    id: 'part-02',
    num: '02',
    side: 'right',
    kicker: 'Part 02',
    heading: (
      <>
        It doesn&rsquo;t just find relevant documents. It finds the{' '}
        <mark className="cj-mark">authoritative</mark> ones.
      </>
    ),
    quote: 'The difference between a relevant answer and the right answer.',
    points: [
      'Semantic similarity is not the same as authority. A document can be closely related to your question and still be the wrong answer.',
      'OfflineIQ builds a dynamic relationship graph across your entire corpus \u2014 mapping how documents reference each other, which clauses govern which obligations, and which precedents your own team cites most.',
      'When you ask a question, the system surfaces answers from the documents your organisation actually relies on \u2014 not just the ones that are textually similar.',
      'The difference between a relevant answer and the right answer.',
    ],
  },
  {
    id: 'part-03',
    num: '03',
    side: 'left',
    kicker: 'Part 03',
    heading: (
      <>
        Every answer comes with a <mark className="cj-mark">trust score</mark>
      </>
    ),
    quote: 'This signal is not a convenience feature. It is a professional safeguard built into every interaction.',
    points: [
      'Generating an answer is the easy part. Knowing whether to act on it is the hard part.',
      'OfflineIQ runs a proprietary verification layer on every response before it reaches you \u2014 cross-referencing multiple independent evidence signals to produce a mathematically derived confidence indicator.',
      { text: 'Strongly grounded in four corroborating sources.', signal: true },
      { text: 'Partially supported with gaps worth reviewing.', signal: true },
      { text: 'Insufficient evidence \u2014 verify independently.', signal: true },
      'For professionals who carry real accountability for their decisions, this signal is not a convenience feature. It is a professional safeguard built into every interaction.',
    ],
  },
  {
    id: 'part-04',
    num: '04',
    side: 'right',
    kicker: 'Part 04',
    heading: (
      <>
        It cites the <mark className="cj-mark">exact clause.</mark> Not just the
        document.
      </>
    ),
    quote: 'Six months from now, you can prove it. Down to the line.',
    points: [
      'Document-level attribution tells you where to look. Clause-level provenance tells you exactly what was read, where it lives, and what it contributed to the answer.',
      'OfflineIQ traces every claim in every response back to its originating section, page, and clause \u2014 and permanently locks that citation record with a cryptographic fingerprint.',
      'The complete evidence trail behind every answer is immutable and audit-ready.',
      'Six months from now, if a regulator, a partner, or a client asks what your AI said and what it based that on \u2014 you can prove it. Down to the line.',
    ],
  },
  {
    id: 'part-05',
    num: '05',
    side: 'left',
    kicker: 'Part 05',
    heading: (
      <>
        It notices when your documents <mark className="cj-mark">change meaning</mark>
        {' \u2014 '}not just when they change
      </>
    ),
    quote: 'Your organisation\u2019s knowledge base is not just stored. It is actively monitored.',
    points: [
      'A document can be updated a hundred times without its meaning changing once. Or it can change one word and shift a legal obligation entirely.',
      'OfflineIQ\u2019s semantic mutation engine analyses every document update at the meaning level \u2014 not the character level. Surface edits are filtered out automatically.',
      'Semantically significant changes \u2014 a liability cap reduced, a payment term extended, a governing law clause quietly modified \u2014 are detected, logged, and surfaced to the right people immediately.',
      'Your organisation\u2019s knowledge base is not just stored. It is actively monitored.',
    ],
  },
  {
    id: 'part-06',
    num: '06',
    side: 'right',
    kicker: 'Part 06',
    heading: (
      <>
        It understands the difference between what changed and{' '}
        <mark className="cj-mark">what matters</mark>
      </>
    ),
    quote: 'Not a track changes report. A professional-grade semantic audit.',
    points: [
      'Running a comparison between two documents and producing a list of differences is a solved problem. Understanding which of those differences carry professional significance is not.',
      'OfflineIQ\u2019s comparative analysis engine operates at the semantic level \u2014 aligning clauses by meaning rather than position, scoring each change by its likely significance to your specific context, and surfacing the ones that matter at the top.',
      'A reformatted paragraph disappears. A liability clause that shifted scope surfaces immediately with a plain language explanation of what changed and why it is worth your attention.',
      'Not a track changes report. A professional-grade semantic audit.',
    ],
  },
]

function Tick({ pos }) {
  return <span className={`cj-tick cj-tick--${pos}`} aria-hidden="true" />
}

function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return undefined

    const nodes = [...root.querySelectorAll('[data-reveal]')]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      nodes.forEach((node) => node.classList.add('is-in'))
      return undefined
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((node) => io.observe(node))
    return () => io.disconnect()
  }, [])

  return ref
}

function PinTitle({ label }) {
  return (
    <SectionPin>
      <h2 className="cj-pin">
        <span className="cj-pin__label">{label}</span>
      </h2>
      <div className="cj-pin__rule" aria-hidden="true" />
    </SectionPin>
  )
}

function Point({ point }) {
  const text = typeof point === 'string' ? point : point.text
  const signal = typeof point === 'object' && point.signal

  return (
    <li className={`cj-point${signal ? ' cj-point--signal' : ''}`}>
      <span className="cj-point__sq" aria-hidden="true" />
      <p>{text}</p>
    </li>
  )
}

function PartAside({ num, quote }) {
  return (
    <div className="cj-part__aside" aria-hidden="true">
      <div className="cj-part__board">
        <Tick pos="tl" />
        <Tick pos="tr" />
        <Tick pos="bl" />
        <Tick pos="br" />
        <span className="cj-part__index">{num}</span>
        <p className="cj-part__quote">{quote}</p>
      </div>
    </div>
  )
}

function PartCopy({ part }) {
  return (
    <div className="cj-part__copy">
      <p className="cj-part__kicker">
        <span className="cj-part__kicker-sq" aria-hidden="true" />
        {part.kicker}
      </p>
      <h3 className="cj-part__heading">{part.heading}</h3>
      <ul className="cj-points">
        {part.points.map((point, i) => (
          <Point key={i} point={point} />
        ))}
      </ul>
    </div>
  )
}

export default function ContentJourneyPage() {
  const revealRef = useReveal()

  usePageMeta({
    title: TITLE,
    description: DESCRIPTION,
    keywords: KEYWORDS,
    image: '/fort-knox.png',
    path: '/content-journey',
  })

  return (
    <main className="cj" ref={revealRef}>
      <section className="cj-hero" aria-labelledby="cj-hero-title">
        <div className="cj-hero__field" aria-hidden="true" />

        <div className="cj-hero__inner">
          <p className="cj-hero__badge" style={{ '--i': 0 }}>
            <span className="cj-hero__mark" aria-hidden="true" />
            Content journey
          </p>

          <h1 className="cj-hero__title" id="cj-hero-title" style={{ '--i': 1 }}>
            From documents you trust to answers{' '}
            <span className="cj-hero__title-line">
              <mark className="cj-hero__highlight">you can defend.</mark>
            </span>
          </h1>

          <p className="cj-hero__caption" style={{ '--i': 2 }}>
            Six capabilities that separate professional-grade private AI from
            generic search-with-a-chat-window — each illustrated with the
            same story your stakeholders already tell themselves about risk,
            evidence, and accountability.
          </p>

          <div className="cj-hero__actions" style={{ '--i': 3 }}>
            <SplitCta size="lg" label="Begin the journey" href="#part-01" />
            <Link className="cj-hero__more" to="/fort-knox">
              Engineering architecture
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <Shell>
        <SectionSep />

        <section className="cj-section" id="journey">
          <ShellInner>
            <PinTitle label="Six capabilities" />

            <div className="cj-trail">
              {PARTS.map((part) => {
                const copy = <PartCopy part={part} />
                const aside = <PartAside num={part.num} quote={part.quote} />

                return (
                  <article
                    key={part.id}
                    className={`cj-part cj-part--${part.side}`}
                    id={part.id}
                    data-reveal
                  >
                    <span className="cj-part__node" aria-hidden="true" />
                    {part.side === 'left' ? (
                      <>
                        {copy}
                        {aside}
                      </>
                    ) : (
                      <>
                        {aside}
                        {copy}
                      </>
                    )}
                  </article>
                )
              })}
            </div>
          </ShellInner>
        </section>

        <SectionSep />

        <Contact
          heading={
            <>
              A trail you can{' '}
              <mark className="contact__mark">produce</mark>, not a chat window
              you have to trust.
            </>
          }
          description="Walk the six capabilities against your own corpus. If the citations do not hold, the work does not ship."
          caption="Book a discovery call. We will map the journey onto the documents you already keep, and what it takes to run it inside your network."
        />
      </Shell>
    </main>
  )
}
