import * as THREE from 'three'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'
import MovieDetails from './MovieDetails'
import axios from 'axios'

const GOLDENRATIO = 1.61803398875

const SERVER_URL = 'https://europe-west2-durhack-404022.cloudfunctions.net/movie/random?seed=1'

const MOVIES = [
  {
    id: '14555',
    overview: 'No overview found.',
    poster_path: '/v7gUz7TWDJKidDsX63HyqVWFikG.jpg',
    original_language: 'fr',
    adult: 'False',
    belongs_to_collection: [],
    genres: ['Drama'],
    budget: '0',
    production_companies: ['Alexandre Films'],
    title: 'Sagan',
    production_countries: ['France'],
    release_date: '2008-06-11',
    runtime: 180,
    tagline: ''
  },
  {
    id: '214418',
    overview:
      'Amazonia is an adventure in 3D inside the largest rainforest on the planet: the Amazon rainforest. Chestnut is a Capuchin monkey domesticated who survives a plane crash and finds himself alone in the dense forest. The monkey needs to learn to live in freedom, in a new world where animals of all kinds: Jaguars, alligators, snakes, tapirs, hawks. Gradually, Brown learns to live in the forest, making new friends, especially the monkey Gaia, their fellow species.',
    poster_path: '/mJ7QmMOJhwbb5qRUo1UfsQjS2Dk.jpg',
    original_language: 'pt',
    adult: 'False',
    belongs_to_collection: [],
    genres: ['Family', 'Adventure'],
    budget: '0',
    production_companies: [
      'France 2 Cinéma',
      'Gullane Filmes',
      'Le Pacte',
      'Canal+',
      'Telecine',
      'Globo filmes',
      'Media Programme of the European Community',
      'Biloba',
      'Tetra Pak',
      'ANCINE/Ministério da Cultura, Fundo Setorial do Audiovisual',
      'Banco da Amazônia',
      'CNC - Nouvelles Technologies en Production',
      'FINEP/Ministério da Ciência, Tecnologia e Inovacão',
      'GDF Suez',
      'La Procirep-Angoa',
      'Natura'
    ],
    title: 'Amazonia',
    production_countries: ['Brazil', 'France'],
    release_date: '2013-11-26',
    runtime: 83,
    tagline: ''
  },
  {
    id: '310814',
    overview:
      "In this love story with Hitchcockian overtones, a computer chip salesman meets the perfect girl (a brilliant software developer) -- and then she disappears. After Jack Livingstone (Justin Kunkle) finds Julie Romanov (Jenn Gotzon) through an Internet dating service, he's convinced life is perfect. But when she vanishes, he's left distraught and confused. Turning to Julie's mother (Hitchcock vet Tippi Hedren), he learns a startling revelation.",
    poster_path: '/neGglXfE3QIhILwu0xw4SdP6Pao.jpg',
    original_language: 'en',
    adult: 'False',
    belongs_to_collection: [],
    genres: ['Romance', 'Science Fiction'],
    budget: '0',
    production_companies: ['Golden Gate Pictures'],
    title: 'Julie & Jack',
    production_countries: ['United States of America'],
    release_date: '2003-01-01',
    runtime: 91,
    tagline: 'Their love is forever'
  },
  {
    id: '61302',
    overview:
      'Culloden is a 1964 docudrama written and directed by Peter Watkins for BBC TV. It portrays the 1746 Battle of Culloden that resulted in the British Army\'s destruction of the Scottish Jacobite uprising and, in the words of the narrator, "tore apart forever the clan system of the Scottish Highlands". Described in its opening credits as "an account of one of the most mishandled and brutal battles ever fought in Britain", Culloden was hailed as a breakthrough for its cinematography as well as its use of non-professional actors and its presentation of an historical event in the style of modern TV war reporting. The film was based on John Prebble\'s study of the battle.',
    poster_path: '/oKVFnfPrkhjcK4s73dcGjD4wi1k.jpg',
    original_language: 'en',
    adult: 'False',
    belongs_to_collection: [],
    genres: ['War', 'Documentary', 'Drama', 'History'],
    budget: '0',
    production_companies: ['British Broadcasting Corporation (BBC)'],
    title: 'Culloden',
    production_countries: ['United Kingdom'],
    release_date: '1964-05-24',
    runtime: 69,
    tagline: ''
  },
  {
    id: '127540',
    overview:
      'This eye-opening documentary follows American basketball player Kevin Sheppard during his 2008-09 season playing for a professional team in Iran. Although Kevin is nervous, he makes many friends, including several politically active Iranian women.',
    poster_path: '/5rtMRuB9l9sG7uFGs7LqXExIZqc.jpg',
    original_language: 'en',
    adult: 'False',
    belongs_to_collection: [],
    genres: ['Documentary'],
    budget: '0',
    production_companies: [],
    title: 'The Iran Job',
    production_countries: ['United States of America', 'Iran'],
    release_date: '2012-09-28',
    runtime: 90,
    tagline: ''
  },
  {
    id: '48287',
    overview: "It's the story about seven very different best friends, and one summer that will bring them together like never before.",
    poster_path: '/1Hbz9SWu98m4LsMPxfRNFIGKxuT.jpg',
    original_language: 'en',
    adult: 'False',
    belongs_to_collection: [],
    genres: ['Comedy', 'Drama', 'Family'],
    budget: '0',
    production_companies: ['Columbia Pictures Corporation', 'Beacon Pictures'],
    title: 'The Baby-Sitters Club',
    production_countries: ['United States of America'],
    release_date: '1995-08-18',
    runtime: 94,
    tagline: 'Friends Forever'
  },
  {
    id: '161297',
    overview:
      "A charming and very daring thief known as Arsene Lupin is terrorizing the wealthy of Paris, he even goes so far as to threaten the Mona Lisa. But the police, led by the great Guerchard, think they know Arsene Lupin's identity, and they have a secret weapon to catch him.",
    poster_path: '/diIDZo7KMKIRXMG2sYQC7QdKUI2.jpg',
    original_language: 'en',
    adult: 'False',
    belongs_to_collection: [],
    genres: ['Mystery', 'Romance'],
    budget: '0',
    production_companies: ['Metro-Goldwyn-Mayer (MGM)'],
    title: 'Arsène Lupin',
    production_countries: ['United States of America'],
    release_date: '1932-03-05',
    runtime: 84,
    tagline: ''
  }
]

export const App = ({ images }) => {
  const [showMovieOverlay, setshowMovieOverlay] = useState(false)
  const [movieData, setMovieData] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Make an API call here
    axios
      .get(SERVER_URL)
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

  console.log(movieData)

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

  return (
    <div className="app-container">
      {loading ? ( // Check if loading is true
        <div>Loading...</div>
      ) : (
        <Canvas className="canvas" dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
          <color attach="background" args={['#191920']} />
          <fog attach="fog" args={['#191920', 0, 15]} />
          <group position={[0, -0.5, 0]}>
            <Title />
            <Frames images={images} onFrameClick={handleFrameClick} />
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[50, 50]} />
              <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={2048}
                mixBlur={1}
                mixStrength={80}
                roughness={1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#050505"
                metalness={0.5}
              />
            </mesh>
          </group>
          <Environment preset="city" />
        </Canvas>
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
