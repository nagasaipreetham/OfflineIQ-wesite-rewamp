import { Link } from 'react-router-dom'
import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import { ArrowRight } from './Button.jsx'
import { greekNumeral } from '../lib/greekNumerals.js'
import './FindYourWorld.css'

const WORLDS = [
  { id: 'healthcare', name: 'Healthcare', to: '/healthcare' },
  { id: 'legal', name: 'Legal', to: '/legal' },
  { id: 'finance', name: 'Finance', to: '/finance' },
  { id: 'research', name: 'Research', to: '/research' },
  { id: 'other', name: 'Other Industries', to: '/industries' },
]

function WorldIcon({ id }) {
  return (
    <svg
      className="world__icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {id === 'healthcare' && (
        <path d="M9.25 3.75h5.5v5.5h5.5v5.5h-5.5v5.5h-5.5v-5.5h-5.5v-5.5h5.5V3.75z" />
      )}
      {id === 'legal' && (
        <>
          <path d="M12 4.25v13" />
          <path d="M6.5 20.25h11" />
          <path d="M4.75 8.25h14.5" />
          <path d="M12 4.25 5.25 8.25" />
          <path d="M12 4.25l6.75 4" />
          <path d="M5.25 8.25 3.5 13.75h3.5L5.25 8.25z" />
          <path d="M18.75 8.25 17 13.75h3.5l-1.75-5.5z" />
        </>
      )}
      {id === 'finance' && (
        <>
          <path d="M3.75 19.25h16.5" />
          <path d="M6.5 16.5v-4.25M10.5 16.5V8.75M14.5 16.5v-6.5M18.5 16.5V6.5" />
        </>
      )}
      {id === 'research' && (
        <>
          <circle cx="11" cy="11" r="6.25" />
          <path d="m15.6 15.6 4.15 4.15" />
        </>
      )}
      {id === 'other' && (
        <>
          <rect x="3.75" y="3.75" width="7" height="7" rx="1.2" />
          <rect x="13.25" y="3.75" width="7" height="7" rx="1.2" />
          <rect x="3.75" y="13.25" width="7" height="7" rx="1.2" />
          <rect x="13.25" y="13.25" width="7" height="7" rx="1.2" />
        </>
      )}
    </svg>
  )
}

function FindYourWorld() {
  return (
    <section className="world" id="find-your-world">
      <ShellInner>
        <SectionPin>
          <h2 className="world__title">
            <span className="world__pin-num" aria-hidden="true">
              {greekNumeral(9)}.
            </span>
            <span className="world__label">Find Your World</span>
          </h2>
          <div className="world__rule" aria-hidden="true" />
        </SectionPin>

        <div className="world__intro">
          <h3 className="world__heading">
            A hospital reads risk differently than a law firm. See what this looks
            like in <mark className="world__mark">yours</mark>.
          </h3>
        </div>

        <div className="world__row">
          {WORLDS.map((world, i) => (
            <Link
              key={world.id}
              className={`world__card world__card--${world.id}`}
              to={world.to}
            >
              <span className="world__num" aria-hidden="true">
                {i + 1}
              </span>
              <WorldIcon id={world.id} />
              <span className="world__name">{world.name}</span>
              <span className="world__go">
                View
                <ArrowRight />
              </span>
            </Link>
          ))}
        </div>
      </ShellInner>
    </section>
  )
}

export default FindYourWorld
