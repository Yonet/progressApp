import { useAppStore } from '../app/store'
import { metaOf, thumbStyle } from '../lib/photo'

export default function Gallery() {
  const photos = useAppStore((s) => s.photos)
  const startNew = useAppStore((s) => s.startNew)
  const openDetail = useAppStore((s) => s.openDetail)

  return (
    <div className="screen">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '18px 20px 12px',
        }}
      >
        <div className="hand" style={{ fontSize: 34, lineHeight: 1 }}>
          Progress
        </div>
        <div style={{ fontSize: 12, color: '#999' }}>
          {photos.length ? `${photos.length} photo${photos.length === 1 ? '' : 's'}` : ''}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 16px 16px' }}>
        {photos.length > 0 ? (
          <div className="grid2">
            {photos.map((p) => (
              <div key={p.id} className="cell" onClick={() => openDetail(p)}>
                <div style={thumbStyle(p)} />
                <div className="cell-meta">{metaOf(p)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '64px 24px' }}>
            <div className="hand" style={{ fontSize: 24, color: '#666', marginBottom: 8 }}>
              No photos yet
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
              Take your first progress photo and align it to the figure guide.
            </div>
          </div>
        )}
      </div>
      <div className="footer">
        <div className="btn dark" onClick={startNew}>
          + New photo
        </div>
      </div>
    </div>
  )
}
