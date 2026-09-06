import AsciiViewer from './AsciiViewer'

/**
 * Each BrainPage renders two side-by-side ASCII viewers:
 *   - Left: smaller / zoomed-out version
 *   - Right: bigger / detailed version
 */
export default function BrainPage({ modelPath, title }) {
  return (
    <div className="brain-page">
      <h1 className="brain-page-title">{title}</h1>

      <div className="brain-split">
        {/* Left — smaller / lower resolution */}
        <div className="brain-panel left">
          <span className="panel-label">Compact</span>
          <AsciiViewer
            modelPath={modelPath}
            resolution={0.12}
            scale={2.2}
            className="viewer-small"
          />
        </div>

        {/* Right — bigger / higher resolution */}
        <div className="brain-panel right">
          <span className="panel-label">Detail</span>
          <AsciiViewer
            modelPath={modelPath}
            resolution={0.22}
            scale={3.6}
            className="viewer-large"
          />
        </div>
      </div>
    </div>
  )
}
