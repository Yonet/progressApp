import { useAppStore } from '../app/store'
import { metaOf, thumbStyle } from '../lib/photo'

export default function Pick() {
  const { photos, after, backToGalleryFromPick, chooseBefore } = useAppStore()
  const items = after ? photos.filter((p) => p.id !== after.id) : photos

  return (
    <div className="screen">
      <div className="screen-head" style={{ paddingBottom: 4 }}>
        <div className="back-btn" onClick={backToGalleryFromPick}>
          &#8249;
        </div>
        <div className="screen-title" style={{ fontSize: 24 }}>
          Compare with…
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#999', padding: '0 20px 8px' }}>
        Aligned automatically by the figure pose
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 16px 16px' }}>
        <div className="grid2">
          {items.map((p) => (
            <div key={p.id} className="cell" onClick={() => chooseBefore(p)}>
              <div style={thumbStyle(p)} />
              <div className="cell-meta">{metaOf(p)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
