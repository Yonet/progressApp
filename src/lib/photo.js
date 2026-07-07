// Shared photo helpers: labels, aligned layer transforms, canvas capture and
// collage rendering. All output frames are 3:4 (720x960).

const W = 720
const H = 960

export const metaOf = (p) => p.dateLabel + (p.weight ? ' · ' + p.weight + ' kg' : '')
export const lbl = (p) => p.dateLabel + (p.weight ? '  ' + p.weight + ' kg' : '')

export const thumbStyle = (p) => ({
  aspectRatio: '3 / 4',
  borderRadius: '12px',
  backgroundColor: '#eee',
  backgroundImage: `url(${p.dataUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
})

// Positions a photo so its alignment figure lands at a normalized reference
// pose (center 0.5/0.5, height 0.8), letting any two photos overlay cleanly.
export const layerStyle = (p) => {
  const s = 0.8 / p.sk.h
  const tx = (0.5 - p.sk.cx * s) * 100
  const ty = (0.5 - p.sk.cy * s) * 100
  return {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${p.dataUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transform: `translate(${tx}%,${ty}%) scale(${s})`,
    transformOrigin: '0 0',
  }
}

export function coverToDataURL(srcEl, sw, sh) {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, W, H)
  const scale = Math.max(W / sw, H / sh)
  const dw = sw * scale
  const dh = sh * scale
  ctx.drawImage(srcEl, (W - dw) / 2, (H - dh) / 2, dw, dh)
  return c.toDataURL('image/jpeg', 0.82)
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawLabel(ctx, x, y, text, align) {
  ctx.font = '600 26px -apple-system,system-ui,sans-serif'
  const w = ctx.measureText(text).width + 24
  const bx = align === 'right' ? x - w : x
  ctx.fillStyle = 'rgba(0,0,0,.62)'
  roundRect(ctx, bx, y, w, 38, 8)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillText(text, bx + 12, y + 20)
}

export async function buildCollageBlob({ before, after, slider, infoMode }) {
  if (!before || !after) return null
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, W, H)
  const load = (u) =>
    new Promise((res) => {
      const i = new Image()
      i.onload = () => res(i)
      i.src = u
    })
  const [bi, ai] = await Promise.all([load(before.dataUrl), load(after.dataUrl)])
  const draw = (img, p) => {
    const s = 0.8 / p.sk.h
    ctx.save()
    ctx.translate((0.5 - p.sk.cx * s) * W, (0.5 - p.sk.cy * s) * H)
    ctx.scale(s, s)
    ctx.drawImage(img, 0, 0, W, H)
    ctx.restore()
  }
  draw(bi, before)
  const dx = (slider / 100) * W
  ctx.save()
  ctx.beginPath()
  ctx.rect(dx, 0, W - dx, H)
  ctx.clip()
  draw(ai, after)
  ctx.restore()
  ctx.fillStyle = '#fff'
  ctx.fillRect(dx - 2, 0, 4, H)
  if (infoMode === 'overlay') {
    drawLabel(ctx, 14, H - 46, lbl(before), 'left')
    drawLabel(ctx, W - 14, H - 46, lbl(after), 'right')
  }
  return new Promise((resolve) => c.toBlob((b) => resolve(b), 'image/jpeg', 0.9))
}

export function downloadBlob(blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'progress-' + Date.now() + '.jpg'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 3000)
}
