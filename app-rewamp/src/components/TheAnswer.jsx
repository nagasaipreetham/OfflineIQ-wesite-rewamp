import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import './TheAnswer.css'

const POINTS = [
  'Fort Knox keeps all documents, queries, and outputs within your environment. Nothing is sent to external services, and there is no per-token usage cost.',
  'The AI model runs directly on hardware inside your network. Queries and documents are processed locally, with no outbound connection required.',
]

function TheAnswer() {
  return (
    <section className="answer" id="the-answer">
      <ShellInner>
        <SectionPin>
          <h2 className="answer__title">
            <span className="answer__pin-num" aria-hidden="true">
              {greekNumeral(3)}.
            </span>
            <span className="answer__label">The answer</span>
          </h2>
          <div className="answer__rule" aria-hidden="true" />
        </SectionPin>

        <div className="answer__split">
          <div className="answer__copy">
            <h3 className="answer__heading">
              The AI runs where your <mark className="answer__mark">Data Lives</mark>.
            </h3>

            <ol className="answer__points">
              {POINTS.map((text, i) => (
                <li key={i} className="answer__point">
                  <span className="answer__num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="answer__media">
            <div className="answer__visual">
              <img
                className="answer__image"
                src="/Fort-Knox-cost.png"
                alt="Cost over time: token-based AI rises while Fort Knox stays flat"
                width={1672}
                height={941}
              />
              <span className="answer__tick answer__tick--tl" aria-hidden="true" />
              <span className="answer__tick answer__tick--tr" aria-hidden="true" />
              <span className="answer__tick answer__tick--bl" aria-hidden="true" />
              <span className="answer__tick answer__tick--br" aria-hidden="true" />
            </div>
            <p className="answer__note">
              At 250 employees running 50 queries a day, a metered cloud model lands in
              the range of $3,750 to $4,500 a month, and that range only grows as
              adoption grows. Fort Knox runs the same workload for one flat cost, whether
              the team asks ten questions today or ten thousand.
            </p>
          </div>
        </div>
      </ShellInner>
    </section>
  )
}

export default TheAnswer
