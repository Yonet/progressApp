import { useAppStore } from '../app/store'

export default function Setup() {
  const { src, view, head, toGallery, setSrc, setView, toggleHead, beginCapture } =
    useAppStore()

  return (
    <div className="screen">
      <div className="screen-head">
        <div className="back-btn" onClick={toGallery}>
          &#8249;
        </div>
        <div className="screen-title">New photo</div>
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '10px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        <div>
          <div className="section-label">Source</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div
              className={`src-card${src === 'camera' ? ' active' : ''}`}
              onClick={() => setSrc('camera')}
            >
              &#128247;
              <div style={{ fontSize: 13, marginTop: 6 }}>Camera</div>
            </div>
            <div
              className={`src-card${src === 'photo' ? ' active' : ''}`}
              onClick={() => setSrc('photo')}
            >
              &#128444;
              <div style={{ fontSize: 13, marginTop: 6 }}>Pick photo</div>
            </div>
          </div>
        </div>
        <div>
          <div className="section-label">Alignment figure</div>
          <div className="seg">
            {['front', 'side', 'back'].map((v) => (
              <div
                key={v}
                className={`seg-btn${view === v ? ' active' : ''}`}
                onClick={() => setView(v)}
              >
                {v[0].toUpperCase() + v.slice(1)}
              </div>
            ))}
          </div>
        </div>
        <div
          onClick={toggleHead}
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 15 }}>Include head</span>
          <div
            style={{
              width: 46,
              height: 26,
              borderRadius: 13,
              background: head ? '#111' : '#ccc',
              position: 'relative',
              transition: 'background .15s',
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 3,
                left: head ? 23 : 3,
                transition: 'left .15s',
              }}
            />
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: '#aaa',
            lineHeight: 1.5,
            border: '1px dashed #e0e0e0',
            borderRadius: 12,
            padding: '12px 14px',
          }}
        >
          Next: drag the figure onto your body to line up the shot. Both photos in a
          collage are aligned by this same figure.
        </div>
      </div>
      <div className="footer">
        <div className="btn dark" onClick={beginCapture}>
          Continue
        </div>
      </div>
    </div>
  )
}
