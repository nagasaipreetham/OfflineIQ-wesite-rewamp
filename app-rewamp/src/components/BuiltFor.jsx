import './BuiltFor.css'

const INDUSTRIES = [
  'Government',
  'Defense',
  'Insurance',
  'Manufacturing',
  'Pharma',
  'Energy',
  'Education',
  'Logistics',
  'Telecom',
  'Legal',
  'Healthcare',
  'Finance',
]

function Track() {
  return (
    <ul className="builtfor__track" aria-hidden="true">
      {INDUSTRIES.map((name) => (
        <li key={name} className="builtfor__item">
          {name}
        </li>
      ))}
    </ul>
  )
}

function BuiltFor() {
  return (
    <section className="builtfor" aria-label="Built for industries">
      <div className="builtfor__inner">
        <p className="builtfor__heading">Built for</p>
        <div className="builtfor__marquee">
          <div className="builtfor__viewport">
            <div className="builtfor__rail">
              <Track />
              <Track />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BuiltFor
