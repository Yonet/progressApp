import { create } from 'zustand'

const STORAGE_KEY = 'pp_photos_v1'

function loadPhotos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function persistPhotos(photos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos))
  } catch {
    alert('Storage is full — delete some photos to save more.')
  }
}

export const useAppStore = create((set, get) => ({
  screen: 'gallery',
  photos: loadPhotos(),

  // capture settings
  src: 'camera',
  view: 'front',
  head: true,
  captureImg: null,
  sk: { cx: 0.5, cy: 0.5, h: 0.8 },

  // review draft
  draft: null,
  weight: '',
  notes: '',
  infoMode: 'overlay',

  // collage / detail
  lastSavedId: null,
  before: null,
  after: null,
  slider: 50,
  detail: null,

  toGallery: () => set({ screen: 'gallery', captureImg: null, detail: null }),
  startNew: () => set({ screen: 'setup' }),
  setSrc: (src) => set({ src }),
  setView: (view) => set({ view }),
  toggleHead: () => set((s) => ({ head: !s.head })),

  beginCapture: () =>
    set({ captureImg: null, sk: { cx: 0.5, cy: 0.5, h: 0.8 }, screen: 'capture' }),
  setCaptureImg: (captureImg) => set({ captureImg }),
  setSk: (sk) => set({ sk }),

  toReview: (dataUrl) => {
    const { sk, view, head } = get()
    const d = new Date()
    const dateLabel = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    set({
      draft: { dataUrl, sk: { ...sk }, view, head, date: d.toISOString(), dateLabel },
      weight: '',
      notes: '',
      infoMode: 'overlay',
      screen: 'review',
    })
  },
  retake: () => set({ screen: 'capture' }),

  setWeight: (weight) => set({ weight }),
  setNotes: (notes) => set({ notes }),
  setInfoMode: (infoMode) => set({ infoMode }),

  savePhoto: () => {
    const { draft, weight, notes, infoMode, photos } = get()
    const photo = {
      id: Date.now(),
      dataUrl: draft.dataUrl,
      sk: draft.sk,
      view: draft.view,
      head: draft.head,
      date: draft.date,
      dateLabel: draft.dateLabel,
      weight: weight.trim(),
      notes: notes.trim(),
      infoMode,
    }
    const next = [photo, ...photos]
    persistPhotos(next)
    set({ photos: next, lastSavedId: photo.id, screen: 'saved' })
  },

  startCollageFlow: () => {
    const { photos, lastSavedId } = get()
    const after = photos.find((p) => p.id === lastSavedId) || photos[0]
    set({ after, screen: 'pick' })
  },
  backToGalleryFromPick: () => set({ screen: 'gallery' }),
  chooseBefore: (p) => {
    const { after } = get()
    set({
      before: p,
      slider: 50,
      infoMode: after ? after.infoMode : 'overlay',
      screen: 'collage',
    })
  },
  setSlider: (slider) => set({ slider }),

  openDetail: (p) => set({ detail: p, screen: 'detail' }),
  deleteDetail: () => {
    const { detail, photos } = get()
    if (!detail) return
    const next = photos.filter((x) => x.id !== detail.id)
    persistPhotos(next)
    set({ photos: next, detail: null, screen: 'gallery' })
  },
  compareDetail: () => set((s) => ({ after: s.detail, screen: 'pick' })),
}))
