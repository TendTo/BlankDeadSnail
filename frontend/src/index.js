import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

const pexel = (id) => `https://d167y3o4ydtmfg.cloudfront.net/763/studio/assets/v1574917367761_481104120/Tomato.png`
const images = [
  // Left
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: pexel(358574) }

  // Right
  // { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(1738986) }
]

createRoot(document.getElementById('root')).render(<App images={images} />)
