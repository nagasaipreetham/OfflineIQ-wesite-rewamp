import './EmptyPage.css'

/** Route shell: header + footer only (via layout). Body intentionally empty. */
export default function EmptyPage({ title = 'Page' }) {
  return (
    <main className="page-empty" aria-label={title}>
      <div className="page-empty__spacer" />
    </main>
  )
}
