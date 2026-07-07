import { useAppStore } from '../app/store'
import { metaOf } from '../lib/photo'

export default function Detail() {
  const { photos, detail, toGallery, deleteDetail, compareDetail } = useAppStore()

  return (
    <div className="screen">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 18px 8px',
        }}
      >
        <div style={{ cursor: 'pointer', fontSize: 24, color: '#666' }} onClick={toGallery}>
          &#8249;
        </div>
        <div style={{ cursor: 'pointer', fontSize: 13, color: '#b00' }} onClick={deleteDetail}>
          Delete
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 18px' }}>
        <div
          style={{
            width: '100%',
            aspectRatio: '3 / 4',
            borderRadius: 14,
            backgroundColor: '#111',
            backgroundImage: detail ? `url(${detail.dataUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div style={{ padding: '14px 2px' }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{detail ? metaOf(detail) : ''}</div>
          {detail && detail.notes && (
            <div style={{ fontSize: 13, color: '#666', marginTop: 6, lineHeight: 1.5 }}>
              {detail.notes}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '8px 16px calc(16px + env(safe-area-inset-bottom))' }}>
        {photos.length > 1 ? (
          <div
            className="btn dark"
            style={{ padding: 15, borderRadius: 14, fontSize: 15 }}
            onClick={compareDetail}
          >
            Compare with another photo
          </div>
        ) : (
          <div style={{ textAlign: 'center', fontSize: 12, color: '#aaa' }}>
            Add another photo to make a collage.
          </div>
        )}
      </div>
    </div>
  )
}
