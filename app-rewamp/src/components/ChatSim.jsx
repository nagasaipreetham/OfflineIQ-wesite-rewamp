import { useEffect, useState } from 'react'
import './ChatSim.css'

function ChatGlyph() {
  return (
    <svg className="chat__glyph" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4h18v12H8l-5 4V4z" />
    </svg>
  )
}

function PinGlyph() {
  return (
    <svg className="chat__glyph chat__glyph--pin" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function PlaneGlyph() {
  return (
    <svg className="chat__glyph chat__glyph--plane" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </svg>
  )
}

function ChevronGlyph() {
  return (
    <svg className="chat__glyph chat__glyph--chev" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function ChatSim({
  phase = 'idle',
  typed = '',
  caretOn = false,
  userMsg = null,
  replyMsg = null,
  files = [],
  accuracy = 0,
}) {
  const [open, setOpen] = useState(false)
  const composing = typed.length > 0 || caretOn
  const flying = phase === 'plane'
  const showRestingPlane = phase !== 'plane'

  useEffect(() => {
    if (!replyMsg) setOpen(false)
  }, [replyMsg])

  return (
    <div
      className="chat"
      data-phase={phase}
      role="img"
      aria-label="Simulated OfflineIQ chat answering a question from private company documents"
    >
      <div className="chat__head">
        <span className="chat__brand">OfflineIQ</span>
        <ChatGlyph />
      </div>

      <div className="chat__body">
        {userMsg && (
          <div
            className={`chat__msg chat__msg--user${phase === 'float' ? ' is-arriving' : ''}`}
          >
            <span className="chat__bubble">{userMsg.text}</span>
            <span className="chat__time">{userMsg.time}</span>
          </div>
        )}

        {replyMsg && (
          <div className="chat__msg chat__msg--iq is-arriving">
            <span className="chat__bubble">{replyMsg}</span>

            <div className="chat__meta-row">
              <button
                type="button"
                className={`chat__cite${open ? ' is-open' : ''}`}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <span>
                  {files.length} citation{files.length === 1 ? '' : 's'}
                </span>
                <ChevronGlyph />
              </button>

              {accuracy > 0 && (
                <span className="chat__acc">
                  <em>{accuracy}%</em> Accurate
                </span>
              )}
            </div>

            {open && (
              <ul className="chat__files">
                {files.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="chat__foot">
        <div className={`chat__input${composing ? ' is-live' : ''}`}>
          <PinGlyph />
          {composing ? (
            <span className="chat__typed">
              {typed}
              {caretOn && <i className="chat__caret" />}
            </span>
          ) : (
            <span className="chat__placeholder">What&rsquo;s on your mind today?</span>
          )}
        </div>

        <div className={`chat__send${phase === 'press' ? ' is-press' : ''}`}>
          {showRestingPlane && <PlaneGlyph />}
          {flying && (
            <>
              <span className="chat__plane-fly">
                <PlaneGlyph />
              </span>
              <span className="chat__plane-enter">
                <PlaneGlyph />
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatSim
