import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import './Models.css'

function Models() {
  return (
    <section className="models" id="models">
      <ShellInner>
        <SectionPin>
          <h2 className="models__title">
            <span className="models__label">Models</span>
          </h2>
          <div className="models__rule" aria-hidden="true" />
        </SectionPin>

        <div className="models__intro">
          <h3 className="models__heading">
            The <mark className="models__mark">Intelligence</mark> Inside IQ Box
          </h3>
          <p className="models__caption">
            From lightweight, high-speed inference to larger models built for more demanding generation and reasoning workloads, 
            IQ BOX delivers powerful AI performance without leaving your environment.
          </p>
        </div>

        <div className="models__table-wrap">
          <table className="models__table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="models__cell">AI Model</span>
                </th>
                <th scope="col">
                  <span className="models__cell">Parameters</span>
                </th>
                <th scope="col">
                  <span className="models__cell">Workload Profile</span>
                </th>
                <th scope="col">
                  <span className="models__cell">Inference Speed</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="models__cell">Qwen 2.5 3B</span>
                </td>
                <td>
                  <span className="models__cell">3B</span>
                </td>
                <td>
                  <span className="models__cell">High-speed inference</span>
                </td>
                <td>
                  <span className="models__cell">153.93 tok/s</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="models__cell">Qwen 2.5 14B</span>
                </td>
                <td>
                  <span className="models__cell">14B</span>
                </td>
                <td>
                  <span className="models__cell">Advanced reasoning &amp; generation</span>
                </td>
                <td>
                  <span className="models__cell">56.38 tok/s</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>Performance measured on IQ BOX - VX01.  Results may vary.</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </ShellInner>
    </section>
  )
}

export default Models
