import './HowWorksHome.css'

const STEPS = [
  {
    n: '01',
    src: '/how-it-works/step-1.png',
    alt: 'Stacked documents, a database, and a folder',
    name: (
      <>
        Connect
        <br />
        Sources
      </>
    ),
    cap: (
      <>
        Your data,
        <br />
        in your environment.
      </>
    ),
  },
  {
    n: '02',
    src: '/how-it-works/step-2.png',
    alt: 'A document inside a scan frame',
    name: (
      <>
        OCR +
        <br />
        Extraction
      </>
    ),
    cap: (
      <>
        Turn files into
        <br />
        usable context.
      </>
    ),
  },
  {
    n: '03',
    src: '/how-it-works/step-3.png',
    alt: 'A hierarchy of connected blocks',
    name: (
      <>
        Structure +
        <br />
        Hierarchy
      </>
    ),
    cap: (
      <>
        Organize meaning,
        <br />
        not just text.
      </>
    ),
  },
  {
    n: '04',
    src: '/how-it-works/step-4.png',
    alt: 'IQ node connected to surrounding data',
    name: (
      <>
        IQ-Weave
        <br />
        Adaptation
      </>
    ),
    cap: (
      <>
        Adapt to
        <br />
        your language,
        <br />
        structure, and logic.
      </>
    ),
  },
  {
    n: '05',
    src: '/how-it-works/step-5.png',
    alt: 'OfflineIQ hardware cube',
    name: (
      <>
        Private
        <br />
        Digital Twin
      </>
    ),
    cap: (
      <>
        A company-specific
        <br />
        model that lives
        <br />
        on your hardware.
      </>
    ),
  },
  {
    n: '06',
    src: '/how-it-works/step-6.png',
    alt: 'Chat, workflow, and analytics blocks wired together',
    name: (
      <>
        Agents +
        <br />
        Workflows
      </>
    ),
    cap: (
      <>
        Purpose-built
        <br />
        agents that
        <br />
        get work done.
      </>
    ),
  },
  {
    n: '07',
    src: '/how-it-works/step-7.png',
    alt: 'A verified document with a check mark',
    name: (
      <>
        Cited +
        <br />
        Human-Verified
        <br />
        Output
      </>
    ),
    cap: (
      <>
        Trusted answers
        <br />
        with sources,
        <br />
        reviewed by people.
      </>
    ),
  },
]

function FlowArrow() {
  return (
    <svg className="hiw__arrow-icon" viewBox="0 0 22 12" aria-hidden="true">
      <path
        d="M1 6h17.5M14.2 1.6 19.8 6l-5.6 4.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function PipelineFlow() {
  return (
    <div className="hiw__flow">
      <ol className="hiw__steps">
        {STEPS.map((step, i) => (
          <li key={step.n} className="hiw__step">
            <div className="hiw__copy">
              <div className="hiw__head">
                <span className="hiw__index">{step.n}</span>
                <h4 className="hiw__name">{step.name}</h4>
              </div>
              <p className="hiw__cap">{step.cap}</p>
            </div>
            <div className="hiw__visual">
              <img
                className="hiw__image"
                src={step.src}
                alt={step.alt}
                width={512}
                height={512}
                loading="lazy"
                decoding="async"
              />
            </div>
            {i < STEPS.length - 1 ? (
              <span className="hiw__arrow" aria-hidden="true">
                <FlowArrow />
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      <footer className="hiw__rails">
        <p className="hiw__rail">
          <span aria-hidden="true">+</span> On your hardware
        </p>
        <p className="hiw__rail hiw__rail--right">
          Built for what matters <span aria-hidden="true">+</span>
        </p>
      </footer>
    </div>
  )
}
