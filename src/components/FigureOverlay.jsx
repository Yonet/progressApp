// Dashed alignment figure drawn over the camera frame. Same proportions are
// assumed by layerStyle/buildCollageBlob when overlaying two photos.
export default function FigureOverlay({ view, head }) {
  const isSide = view === 'side'
  return (
    <svg
      viewBox="0 0 100 220"
      style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
      fill="none"
      stroke="#fff"
      strokeWidth="3"
      strokeDasharray="6 5"
      strokeLinecap="round"
    >
      {isSide ? (
        <>
          <line x1="48" y1="33" x2="46" y2="120" />
          <line x1="47" y1="58" x2="66" y2="112" />
          <line x1="46" y1="120" x2="40" y2="210" />
          <line x1="46" y1="120" x2="60" y2="206" />
        </>
      ) : (
        <>
          <line x1="50" y1="33" x2="50" y2="120" />
          <line x1="28" y1="52" x2="72" y2="52" />
          <line x1="28" y1="52" x2="20" y2="118" />
          <line x1="72" y1="52" x2="80" y2="118" />
          <line x1="34" y1="120" x2="66" y2="120" />
          <line x1="40" y1="120" x2="32" y2="210" />
          <line x1="60" y1="120" x2="68" y2="210" />
        </>
      )}
      {head && <circle cx={isSide ? 46 : 50} cy="20" r="13" />}
    </svg>
  )
}
