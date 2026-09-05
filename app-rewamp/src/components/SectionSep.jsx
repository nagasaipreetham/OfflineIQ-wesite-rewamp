import './SectionSep.css'

/**
 * Full-bleed section separator: Diagonal Hatch #41 with hairlines
 * immediately above and below (from public/separators.html).
 */
function SectionSep() {
  return (
    <div className="section-sep" aria-hidden="true">
      <div className="section-sep__hatch" />
    </div>
  )
}

export default SectionSep
