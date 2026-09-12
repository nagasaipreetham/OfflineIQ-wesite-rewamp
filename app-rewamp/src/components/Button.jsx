import './Button.css'

export const CTA_LABEL = 'Book a Discovery Call'
export const CTA_HREF = '/consultation'

export function ArrowRight() {
  return (
    <svg viewBox="0 0 15 15" fill="none">
      <path
        d="M2.25 7.5h10.5M8.75 3.75 12.5 7.5l-3.75 3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* two arrows in a masked box: the first leaves right as the second enters */
export function ArrowSwap() {
  return (
    <span className="arrow-swap" aria-hidden="true">
      <ArrowRight />
      <ArrowRight />
    </span>
  )
}

/*
 * The label and the arrow are two independent buttons sitting flush against
 * each other; hovering either one drives both.
 */
export function SplitCta({
  label = CTA_LABEL,
  href = CTA_HREF,
  className = '',
  size = '',
  onClick,
}) {
  const sizeClass = size === 'lg' ? 'btn--lg' : ''

  return (
    <div className={`btn-split ${className}`.trim()}>
      <a
        className={`btn btn--primary btn-split__label ${sizeClass}`.trim()}
        href={href}
        onClick={onClick}
      >
        {label}
      </a>
      <a
        className={`btn btn--primary btn-split__arrow ${sizeClass}`.trim()}
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClick}
      >
        <ArrowSwap />
      </a>
    </div>
  )
}
