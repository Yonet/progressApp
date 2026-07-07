import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../app/store'
import { coverToDataURL } from '../lib/photo'
import FigureOverlay from '../components/FigureOverlay'

export default function Capture() {
  const {
    src,
    view,
    head,
    sk,
    captureImg,
    toGallery,
    setView,
    toggleHead,
    setSk,
    setCaptureImg,
    toReview,
  } = useAppStore()

  const frameRef = useRef(null)
  const videoRef = useRef(null)
  const fileRef = useRef(null)
  const streamRef = useRef(null)
  const draggingRef = useRef(false)
  const timerRef = useRef(null)
  const [counting, setCounting] = useState(0)
  const [camError, setCamError] = useState(null)

  useEffect(() => {
    if (src !== 'camera') return undefined
    let cancelled = false
    const start = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCamError('Camera not supported here — use the photo button.')
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
      } catch {
        setCamError('Camera unavailable — tap the photo button to pick an image.')
      }
    }
    start()
    return () => {
      cancelled = true
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [src])

  useEffect(() => () => clearInterval(timerRef.current), [])

  const pickFile = () => fileRef.current && fileRef.current.click()
  const onFile = (e) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => {
      setCaptureImg(r.result)
      setCamError(null)
    }
    r.readAsDataURL(f)
    e.target.value = ''
  }

  const skDown = (e) => {
    e.preventDefault()
    draggingRef.current = true
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* pointer capture unsupported */
    }
  }
  const skMove = (e) => {
    if (!draggingRef.current || !frameRef.current) return
    const r = frameRef.current.getBoundingClientRect()
    const cx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
    const cy = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height))
    setSk({ ...sk, cx, cy })
  }
  const skUp = () => {
    draggingRef.current = false
  }

  const capture = () => {
    if (src === 'camera') {
      const v = videoRef.current
      if (!v || !v.videoWidth) {
        setCamError('Camera still starting…')
        return
      }
      toReview(coverToDataURL(v, v.videoWidth, v.videoHeight))
    } else {
      if (!captureImg) {
        pickFile()
        return
      }
      const img = new Image()
      img.onload = () => toReview(coverToDataURL(img, img.naturalWidth, img.naturalHeight))
      img.src = captureImg
    }
  }

  const startTimer = () => {
    if (counting) return
    let n = 3
    setCounting(n)
    timerRef.current = setInterval(() => {
      n -= 1
      if (n <= 0) {
        clearInterval(timerRef.current)
        setCounting(0)
        capture()
      } else {
        setCounting(n)
      }
    }, 1000)
  }

  return (
    <div className="screen" style={{ background: '#000' }}>
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={onFile}
        style={{ display: 'none' }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px 8px',
          color: '#fff',
        }}
      >
        <div style={{ cursor: 'pointer', fontSize: 22, opacity: 0.85 }} onClick={toGallery}>
          &#10005;
        </div>
        <div style={{ display: 'flex', gap: 7, fontSize: 12 }}>
          {['front', 'side', 'back'].map((v) => (
            <div
              key={v}
              className={`chip${view === v ? ' active' : ''}`}
              onClick={() => setView(v)}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </div>
          ))}
          <div className={`chip${head ? ' active' : ''}`} onClick={toggleHead}>
            Head
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 10px',
          minHeight: 0,
        }}
      >
        <div
          ref={frameRef}
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: '100%',
            aspectRatio: '3 / 4',
            background: '#111',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {src === 'photo' && captureImg && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${captureImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}

          <div
            onPointerDown={skDown}
            onPointerMove={skMove}
            onPointerUp={skUp}
            onPointerCancel={skUp}
            style={{
              position: 'absolute',
              left: `${sk.cx * 100}%`,
              top: `${sk.cy * 100}%`,
              height: `${sk.h * 100}%`,
              aspectRatio: '100 / 220',
              transform: 'translate(-50%,-50%)',
              touchAction: 'none',
              cursor: 'grab',
              filter: 'drop-shadow(0 0 1.5px rgba(0,0,0,.75))',
            }}
          >
            <FigureOverlay view={view} head={head} />
          </div>

          {counting > 0 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,.25)',
              }}
            >
              <div
                className="hand"
                style={{ fontSize: 140, color: '#fff', textShadow: '0 3px 16px rgba(0,0,0,.5)' }}
              >
                {counting}
              </div>
            </div>
          )}
          {camError && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,.6)',
                color: '#fff',
                fontSize: 12,
                padding: '10px 12px',
                textAlign: 'center',
              }}
            >
              {camError}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          padding: '6px 18px 4px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: '#fff',
        }}
      >
        <span style={{ fontSize: 11, opacity: 0.7, width: 34 }}>Size</span>
        <input
          type="range"
          min="0.4"
          max="0.96"
          step="0.01"
          value={sk.h}
          onInput={(e) => setSk({ ...sk, h: parseFloat(e.target.value) })}
          style={{ flex: 1 }}
        />
      </div>
      <div
        style={{
          textAlign: 'center',
          color: '#fff',
          opacity: 0.55,
          fontSize: 11,
          padding: '2px 0 6px',
        }}
      >
        Drag the figure onto your body
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: '6px 0 calc(20px + env(safe-area-inset-bottom))',
        }}
      >
        {src === 'camera' && (
          <div className="cam-side-btn" onClick={startTimer}>
            <div className="ring">&#9201;</div>
            3s
          </div>
        )}
        <div
          onClick={capture}
          style={{
            cursor: 'pointer',
            width: 74,
            height: 74,
            borderRadius: '50%',
            background: '#fff',
            border: '4px solid rgba(255,255,255,.45)',
            boxShadow: '0 0 0 2px #000 inset',
          }}
        />
        {src === 'photo' && (
          <div className="cam-side-btn" onClick={pickFile}>
            <div className="ring">&#128444;</div>
            Photo
          </div>
        )}
        {src === 'camera' && <div style={{ width: 56 }} />}
      </div>
    </div>
  )
}
