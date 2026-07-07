import { useAppStore } from './app/store'
import Gallery from './screens/Gallery'
import Setup from './screens/Setup'
import Capture from './screens/Capture'
import Review from './screens/Review'
import Saved from './screens/Saved'
import Pick from './screens/Pick'
import Collage from './screens/Collage'
import Detail from './screens/Detail'

const SCREENS = {
  gallery: Gallery,
  setup: Setup,
  capture: Capture,
  review: Review,
  saved: Saved,
  pick: Pick,
  collage: Collage,
  detail: Detail,
}

function App() {
  const screen = useAppStore((s) => s.screen)
  const Screen = SCREENS[screen] || Gallery

  return (
    <div className="phone">
      <Screen />
    </div>
  )
}

export default App
