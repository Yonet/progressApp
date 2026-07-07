import { useRef } from 'react'
import { useAppStore } from '../app/store'
import { buildCollageBlob, downloadBlob, layerStyle, lbl } from '../lib/photo'

export default function Collage() {
  const { before, after, slider, infoMode, toGallery, setSlider, setInfoMode } =
    useAppStore()
  const collageRef = useRef(null)
  const slidingRef = useRef(false)

  const sliderMove = (e) => {
    if (!slidingRef.current || !collageRef.current) return
    const r = collageRef.current.getBoundingClientRect()
    const p = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100))
    setSlider(p)
  }
  const sliderDown = (e) => {
    slidingRef.current = true
    sliderMove(e)
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* pointer capture unsupported */
    }
  }
  const sliderUp = () => {
    slidingRef.current = false
  }

  const exportCollage = async () => {
    const b = await buildCollageBlob({ before, after, slider, infoMode })
    if (b) downloadBlob(b)
  }
  const shareCollage = async () => {
    const b = await buildCollageBlob({ before, after, slider, infoMode })
    if (!b) return
    const file = new File([b], 'progress.jpg', { type: 'image/jpeg' })
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'My progress' })
        return
      } catch {
        /* fall back to download */
      }
    }
    downloadBlob(b)
  }

  return (
    <div className="screen">
      <div className="screen-head" style={{ padding: '16px 18px 6px' }}>
        <div className="back-btn" onClick={toGallery}>
          &#8249;
        </div>
        <div className="screen-title" style={{ fontSize: 24 }}>
          Before / After
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 14px',
          minHeight: 0,
        }}
      >
        <div
          ref={collageRef}
          onPointerDown={sliderDown}
          onPointerMove={sliderMove}
          onPointerUp={sliderUp}
          onPointerCancel={sliderUp}
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: '100%',
            aspectRatio: '3 / 4',
            background: '#fff',
            borderRadius: 14,
            overflow: 'hidden',
            touchAction: 'none',
            boxShadow: '0 2px 14px rgba(0,0,0,.12)',
          }}
        >
          {before && <div style={layerStyle(before)} />}
          <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${slider}%)` }}>
            {after && <div style={layerStyle(after)} />}
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${slider}%`,
              width: 3,
              background: '#fff',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 6px rgba(0,0,0,.45)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${slider}%`,
              transform: 'translate(-50%,-50%)',
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 1px 6px rgba(0,0,0,.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333',
              fontSize: 15,
              pointerEvents: 'none',
            }}
          >
            &#8596;
          </div>
          {infoMode === 'overlay' && (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 8,
                  bottom: 8,
                  background: 'rgba(0,0,0,.6)',
                  color: '#fff',
                  fontSize: 11,
                  padding: '4px 8px',
                  borderRadius: 6,
                }}
              >
                {before ? lbl(before) : ''}
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: 8,
                  bottom: 8,
                  background: 'rgba(0,0,0,.6)',
                  color: '#fff',
                  fontSize: 11,
                  padding: '4px 8px',
                  borderRadius: 6,
                }}
              >
                {after ? lbl(after) : ''}
              </div>
            </>
          )}
        </div>
      </div>
      {infoMode === 'caption' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '2px 22px 4px',
            fontSize: 12,
            color: '#444',
          }}
        >
          <span>{before ? lbl(before) : ''}</span>
          <span>{after ? lbl(after) : ''}</span>
        </div>
      )}
      <div style={{ padding: '4px 18px 6px' }}>
        <div className="seg" style={{ borderRadius: 11, fontSize: 12 }}>
          <div
            className={`seg-btn${infoMode === 'overlay' ? ' active' : ''}`}
            onClick={() => setInfoMode('overlay')}
          >
            Info overlaid
          </div>
          <div
            className={`seg-btn${infoMode === 'caption' ? ' active' : ''}`}
            onClick={() => setInfoMode('caption')}
          >
            Caption below
          </div>
        </div>
      </div>
      <div
        style={{
          padding: '6px 16px calc(16px + env(safe-area-inset-bottom))',
          display: 'flex',
          gap: 10,
        }}
      >
        <div className="btn sm outline" style={{ flex: 1 }} onClick={exportCollage}>
          Save image
        </div>
        <div className="btn sm dark" style={{ flex: 1 }} onClick={shareCollage}>
          &#8682; Share
        </div>
      </div>
    </div>
  )
}
