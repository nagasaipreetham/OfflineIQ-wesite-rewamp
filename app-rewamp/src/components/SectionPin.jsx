import './SectionPin.css'

/**
 * Sticky section title bar, pinned under the site header and constrained
 * to the shell column (between the left/right rails).
 * Must be rendered inside ShellInner.
 */
export default function SectionPin({ children }) {
  return <div className="section-pin">{children}</div>
}
