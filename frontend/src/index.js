import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

const pexel = (id) => `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQxP82MWQIP3FK6vB2SbN9u9BeUydFDPQx5tVgjqaX&s`
const images = [
  // Left
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: pexel(358574) },

  // Right
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(1738986) }
]

createRoot(document.getElementById('root')).render(<App images={images} />)
