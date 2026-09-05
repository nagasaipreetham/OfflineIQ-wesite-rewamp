import './Shell.css'

/**
 * Centre-column frame for everything below Partner.
 * Left/right gutters stay empty; hairline rails mark the main column edges.
 * Full-bleed children (e.g. SectionSep) still span the viewport.
 */
function Shell({ children }) {
  return (
    <div className="shell">
      <div className="shell__rail shell__rail--left" aria-hidden="true" />
      <div className="shell__rail shell__rail--right" aria-hidden="true" />
      {children}
    </div>
  )
}

/** Centres content to the same column width as the header. */
export function ShellInner({ children, className = '' }) {
  return <div className={`shell__inner ${className}`.trim()}>{children}</div>
}

export default Shell
