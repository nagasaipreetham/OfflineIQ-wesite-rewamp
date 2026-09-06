import { ShellInner } from './Shell.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import './Models.css'

function Models() {
  return (
    <section className="models" id="models">
      <ShellInner>
        <h2 className="models__title">
          <span className="models__num" aria-hidden="true">
            {greekNumeral(3)}.
          </span>
          <span className="models__label">Models</span>
        </h2>
        <div className="models__rule" aria-hidden="true" />

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
                <th scope="col">AI Model</th>
                <th scope="col">Parameters</th>
                <th scope="col">Workload Profile</th>
                <th scope="col">Inference Speed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Qwen 2.5 3B</td>
                <td>3B</td>
                <td>High-speed inference</td>
                <td>153.93 tok/s</td>
              </tr>
              <tr>
                <td>Qwen 2.5 14B</td>
                <td>14B</td>
                <td>Advanced reasoning &amp; generation</td>
                <td>56.38 tok/s</td>
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
