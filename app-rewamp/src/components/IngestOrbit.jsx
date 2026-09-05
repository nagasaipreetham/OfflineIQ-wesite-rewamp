import './IngestOrbit.css'

/*
 * Source artefacts are drawn from plain elements — no icon fonts, no glyphs.
 * Each one is differentiated by silhouette and internal structure rather than
 * by a coloured file-extension badge, so the set reads as one designed family
 * in the site's blueprint palette: ink hairlines, white stock, one blue accent.
 */

/* Print-set page: header/footer rules, justified body, clipped corner. */
function PdfArt() {
  return (
    <div className="art art--pdf">
      <span className="art__fold" />
      <span className="pdf__rule" />
      <span className="pdf__line" />
      <span className="pdf__line" />
      <span className="pdf__line" />
      <span className="pdf__line pdf__line--last" />
      <span className="pdf__rule pdf__rule--foot" />
      <span className="pdf__folio" />
    </div>
  )
}

/* Word processor: ragged-right prose, first-line indent, live text caret. */
function DocxArt() {
  return (
    <div className="art art--docx">
      <span className="docx__line docx__line--indent" />
      <span className="docx__line" />
      <span className="docx__line docx__line--rag" />
      <span className="docx__gap" />
      <span className="docx__line" />
      <span className="docx__line docx__line--rag2" />
      <span className="docx__caret" />
    </div>
  )
}

/* Spreadsheet: column/row headers, cell grid, selected cell + fill handle. */
function XlsxArt() {
  return (
    <div className="art art--xlsx">
      <div className="xlsx__colhead">
        <span />
        <span />
        <span />
      </div>
      <div className="xlsx__body">
        <div className="xlsx__rowhead">
          <span />
          <span />
          <span />
        </div>
        <div className="xlsx__grid">
          {Array.from({ length: 9 }, (_, i) => (
            <span
              key={i}
              className={`xlsx__cell${i === 4 ? ' is-selected' : ''}`}
            >
              {i === 4 && <span className="xlsx__handle" />}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Deck: stacked sheets behind a 16:9 slide with title rule and content. */
function PptxArt() {
  return (
    <div className="art art--pptx">
      <span className="ppt__sheet ppt__sheet--back" />
      <span className="ppt__sheet ppt__sheet--mid" />
      <div className="ppt__slide">
        <span className="ppt__title" />
        <div className="ppt__cols">
          <div className="ppt__bullets">
            <span />
            <span />
            <span />
          </div>
          <span className="ppt__block" />
        </div>
      </div>
    </div>
  )
}

/* Raster: alpha checkerboard under blocks of pixel data. */
function ImageArt() {
  return (
    <div className="art art--image">
      <span className="img__checks" />
      <span className="img__px img__px--a" />
      <span className="img__px img__px--b" />
      <span className="img__px img__px--c" />
      <span className="img__px img__px--d" />
    </div>
  )
}

/* Markup / plain text: indentation tree with tag-coloured segments. */
const CODE_ROWS = [
  { indent: 0, segs: [{ w: 21, accent: true }] },
  { indent: 5, segs: [{ w: 26 }] },
  { indent: 5, segs: [{ w: 15 }, { w: 8, accent: true }] },
  { indent: 10, segs: [{ w: 19 }] },
  { indent: 5, segs: [{ w: 24 }] },
  { indent: 0, segs: [{ w: 17, accent: true }] },
]

function TextArt() {
  return (
    <div className="art art--text">
      <span className="art__fold" />
      {CODE_ROWS.map((row, i) => (
        <span
          key={i}
          className="text__row"
          style={{ '--indent': `${row.indent}px` }}
        >
          {row.segs.map((seg, j) => (
            <span
              key={j}
              className={`text__seg${seg.accent ? ' is-accent' : ''}`}
              style={{ '--w': `${seg.w}px` }}
            />
          ))}
        </span>
      ))}
    </div>
  )
}

/* Store: platter cylinder with band divisions and one live band. */
function DatabaseArt() {
  return (
    <div className="art art--db">
      <span className="db__wall" />
      <span className="db__band db__band--one" />
      <span className="db__band db__band--two is-live" />
      <span className="db__foot" />
      <span className="db__cap" />
    </div>
  )
}

/* Fixed compass placement — east is left open for the outlet to the chat. */
const SOURCES = [
  { id: 'pdf', angle: 0, dir: 'N', label: 'PDF', Art: PdfArt },
  { id: 'docx', angle: 45, dir: 'NE', label: 'DOCX', Art: DocxArt },
  { id: 'xlsx', angle: 180, dir: 'S', label: 'XLSX', Art: XlsxArt },
  { id: 'pptx', angle: 135, dir: 'SE', label: 'PPTX', Art: PptxArt },
  { id: 'image', angle: 225, dir: 'SW', label: 'PNG / JPG', Art: ImageArt },
  { id: 'text', angle: 270, dir: 'W', label: 'TXT / MD / HTML', Art: TextArt },
  { id: 'db', angle: 315, dir: 'NW', label: 'Databases', Art: DatabaseArt },
]

function IngestOrbit({ phase = 'idle', capsMode = 'default', marks = {} }) {
  return (
    <div
      className="sim"
      role="img"
      aria-label="Documents, spreadsheets, slides, images, text files and databases feeding into OfflineIQ"
    >
      <div className="sim__stage" data-phase={phase} data-caps={capsMode}>
        <span className="sim__orbit" aria-hidden="true" />

        <div className="sim__spokes" aria-hidden="true">
          {SOURCES.map((s, i) => (
            <span
              key={s.id}
              className="sim__spoke"
              data-mark={marks[s.id] ?? 'none'}
              style={{ '--angle': `${s.angle}deg`, '--i': i }}
            >
              <span className="sim__spoke-base" />
              <span className="sim__spoke-fill sim__spoke-fill--blue" />
              <span className="sim__spoke-fill sim__spoke-fill--green" />
              <span className="sim__spoke-dot">
                <i />
              </span>
              <span className="sim__spoke-cap" />
            </span>
          ))}
        </div>

        <div className="sim__core" aria-hidden="true">
          <span className="sim__core-ping" />
          <span className="sim__core-text">IQ</span>
        </div>

        {SOURCES.map(({ id, angle, dir, label, Art }) => (
          <div
            key={id}
            className="sim__node"
            data-dir={dir}
            style={{ '--angle': `${angle}deg` }}
          >
            <span className="sim__spec">
              <Art />
            </span>
            <span className="sim__node-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IngestOrbit
