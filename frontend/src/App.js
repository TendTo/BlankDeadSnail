import * as THREE from 'three'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'
import MovieDetails from './MovieDetails'
import axios from 'axios'
import { Floor } from './Floor'

const GOLDENRATIO = 1.61803398875

const RANDOM_URL = 'https://europe-west2-durhack-404022.cloudfunctions.net/movie/random?seed=1'

/**
 * Main app component
 * @param {{images: Image[]}} images - Array of image objects
 */
export const App = ({ images }) => {
  const [showMovieOverlay, setshowMovieOverlay] = useState(false)
  const [movieData, setMovieData] = useState(null)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Make an API call here
    axios
      .get(RANDOM_URL)
      .then((response) => {
        for (let i = 0; i < images.length; i++) {
          images[i].movie = response.data[i]
        }
        setLoading(false) // Update loading state to false
      })
      .catch((error) => {
        console.error('API call failed', error)
        setLoading(false) // Update loading state to false even in case of an error
      })
  }, [])

  const handleFrameClick = useCallback(
    (bool, newData) => {
      if (bool !== showMovieOverlay) {
        setshowMovieOverlay(bool)
        if (bool) {
          setMovieData(newData)
        }
      }
    },
    [showMovieOverlay]
  )

  const handleSearchInputChange = useCallback((e) => {
    setSearchText(e.target.value)
  }, [])

  const handleRandomClick = () => {
    console.log('Enter')
  }

  return (
    <div className="app-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Canvas className="canvas" dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
          <color attach="background" args={['#191920']} />
          <fog attach="fog" args={['#191920', 0, 15]} />
          <group position={[0, -0.5, 0]}>
            <Title />
            <Frames images={images} onFrameClick={handleFrameClick} />
            <Floor />
          </group>
          <Environment preset="city" />
        </Canvas>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="parent">
          <div className="search-bar-container">
            <input type="text" placeholder="Search..." value={searchText} onChange={handleSearchInputChange} className="search-input" />
            <div className="buttons">
              <button className="search-button" onClick={handleRandomClick}>
                Search
              </button>
              <button className="random-button" onClick={handleRandomClick}>
                Random
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={`movie-description ${showMovieOverlay ? 'show-movie-overlay' : 'hide-movie-overlay'}`}>
        {showMovieOverlay && <MovieDetails {...movieData} />}
      </div>
    </div>
  )
}

function Title() {
  return (
    <Text maxWidth={0.2} position={[0, 2.8, 0]} rotation={[0.0, 0, 0]} fontSize={0.9} color="white">
      IMMERSIO
    </Text>
  )
}

function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3(), onFrameClick }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/movie/:id')
  const [, setLocation] = useLocation()

  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(1.25, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(0, 0, 5.2)
      q.identity()
      onFrameClick(false, {})
    }
  })

  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })

  function handleClick(e) {
    e.stopPropagation()
    setLocation(clicked.current === e.object ? '/' : '/movie/' + e.object.name)
  }

  return (
    <group ref={ref} onClick={handleClick} onPointerMissed={() => setLocation('/')}>
      {images.map((props) => <Frame key={props.url} onFrameClick={onFrameClick} {...props} /> /* prettier-ignore */)}
    </group>
  )
}

function Frame({ url, c = new THREE.Color(), onFrameClick, ...props }) {
  const image = useRef()
  const frame = useRef()
  const [, params] = useRoute('/movie/:id')
  const [hovered, hover] = useState(false)
  const name = getUuid(url)
  const isActive = params?.id === name

  useCursor(hovered)
  useFrame((state, dt) => {
    easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.95 : 1), 0.9 * (!isActive && hovered ? 0.95 : 1), 1], 0.1, dt)
  })

  const imageUrl = props.movie.poster_path ? props.movie.poster_path : url

  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        onClick={() => onFrameClick(true, props.movie)}
        scale={[1, 1.5, 0.03]}
        position={[0, GOLDENRATIO / 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={imageUrl} />
      </mesh>
    </group>
  )
}
