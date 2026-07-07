import { useAppStore } from '../app/store'

export default function Review() {
  const { draft, weight, notes, infoMode, setWeight, setNotes, setInfoMode, retake, savePhoto } =
    useAppStore()

  const draftInfo = draft ? draft.dateLabel + (weight ? '  ·  ' + weight + ' kg' : '') : ''

  return (
    <div className="screen">
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          background: '#111',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: draft ? `url(${draft.dataUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {infoMode === 'overlay' && (
          <div
            style={{
              position: 'absolute',
              left: 10,
              bottom: 10,
              background: 'rgba(0,0,0,.6)',
              color: '#fff',
              fontSize: 12,
              padding: '5px 9px',
              borderRadius: 7,
            }}
          >
            {draftInfo}
          </div>
        )}
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 13,
        }}
      >
        {infoMode === 'caption' && (
          <div style={{ fontSize: 13, color: '#444', fontWeight: 600 }}>{draftInfo}</div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="field-label">DATE</div>
            <div className="field-input">{draft ? draft.dateLabel : ''}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label">WEIGHT (kg)</div>
            <input
              className="field-input"
              value={weight}
              onInput={(e) => setWeight(e.target.value)}
              inputMode="decimal"
              placeholder="—"
            />
          </div>
        </div>
        <div>
          <div className="field-label">NOTES</div>
          <input
            className="field-input"
            value={notes}
            onInput={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling?"
          />
        </div>
        <div>
          <div className="field-label" style={{ marginBottom: 6 }}>
            SHOW INFO AS
          </div>
          <div className="seg" style={{ borderRadius: 11, fontSize: 13 }}>
            <div
              className={`seg-btn${infoMode === 'overlay' ? ' active' : ''}`}
              onClick={() => setInfoMode('overlay')}
            >
              Overlaid
            </div>
            <div
              className={`seg-btn${infoMode === 'caption' ? ' active' : ''}`}
              onClick={() => setInfoMode('caption')}
            >
              Caption
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: '10px 16px calc(16px + env(safe-area-inset-bottom))',
          display: 'flex',
          gap: 10,
        }}
      >
        <div className="btn sm outline" style={{ flex: 1 }} onClick={retake}>
          Retake
        </div>
        <div className="btn sm dark" style={{ flex: 1 }} onClick={savePhoto}>
          Save
        </div>
      </div>
    </div>
  )
}
