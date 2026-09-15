import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import PipelineFlow from './PipelineFlow.jsx'
import './HowWorksHome.css'

function HowWorksHome() {
  return (
    <section className="hiw" id="how-it-works">
      <ShellInner>
        <SectionPin>
          <h2 className="hiw__title">
            <span className="hiw__label">How it works</span>
          </h2>
          <div className="hiw__rule" aria-hidden="true" />
        </SectionPin>

        <div className="hiw__intro">
          <h3 className="hiw__heading">
            It ain&rsquo;t yet another RAG.
          </h3>
          <p className="hiw__lead">
            A proprietary workflow that turns your documents and data into a
            secure, working AI system — built for your business.
          </p>
        </div>

        <PipelineFlow />
      </ShellInner>
    </section>
  )
}

export default HowWorksHome
