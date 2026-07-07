import { useAppStore } from '../app/store'

export default function Saved() {
  const { photos, lastSavedId, startCollageFlow, toGallery } = useAppStore()
  const saved = photos.find((p) => p.id === lastSavedId)

  return (
    <div
      className="screen"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        textAlign: 'center',
      }}
    >
      <div className="hand" style={{ fontSize: 30, marginBottom: 6 }}>
        Saved!
      </div>
      <div
        style={{
          fontSize: 14,
          color: '#777',
          lineHeight: 1.5,
          marginBottom: 22,
          maxWidth: 260,
        }}
      >
        Compare it with a previous photo to see your progress?
      </div>
      <div
        style={{
          width: 130,
          aspectRatio: '3 / 4',
          borderRadius: 14,
          marginBottom: 26,
          boxShadow: '0 3px 14px rgba(0,0,0,.15)',
          backgroundColor: '#eee',
          backgroundImage: saved ? `url(${saved.dataUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {photos.length > 1 ? (
        <div
          className="btn dark"
          style={{ width: '100%', maxWidth: 300, padding: 15, borderRadius: 14, fontSize: 15, marginBottom: 10 }}
          onClick={startCollageFlow}
        >
          Make a collage
        </div>
      ) : (
        <div style={{ fontSize: 12, color: '#aaa', marginBottom: 10 }}>
          Add one more photo to unlock collages.
        </div>
      )}
      <div
        style={{
          cursor: 'pointer',
          width: '100%',
          maxWidth: 300,
          textAlign: 'center',
          padding: 13,
          fontSize: 15,
          color: '#777',
        }}
        onClick={toGallery}
      >
        Not now
      </div>
    </div>
  )
}
