import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'
import React from 'react'

const GOLDENRATIO = 1.61803398875

export const App = ({ images }) => (
  <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
    <color attach="background" args={['#FFFFFF']} />
    <group position={[0, -0.5, 0]}>
      {/* <Frames images={images} /> */}
      {/* <SimpleBox position={[-1, 1, 3]} /> */}
      <Shelfs />
      <Floor />
    </group>
    <Environment preset="city" />
  </Canvas>
)

function Shelfs({ q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  p.set(0, 0, 5.5)
  q.identity()

  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })

  return (
    <group>
      {Shelf('right', [20, GOLDENRATIO, 0.05], [1, GOLDENRATIO / 2, 0], [0, -Math.PI / 2, 0])}
      {Shelf('left', [20, GOLDENRATIO, 0.05], [-1, GOLDENRATIO / 2, 0], [0, Math.PI / 2, 0])}
    </group>
  )
}

function Shelf(side, scale, position, rotation) {
  return (
    <group>
      <ShelfProducts side={side} />
      <mesh name={side} scale={scale} position={position} rotation={rotation}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
      </mesh>
    </group>
  )
}
function Floor() {
  return (
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
        mirror={0}
      />
    </mesh>
  )
}

function SimpleBox({ position, rotation, scale }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color="#FF0000" />
    </mesh>
  )
}

function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(0, 0, 5.5)
      q.identity()
    }
  })
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })
  return (
    <group ref={ref} onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name))} onPointerMissed={() => setLocation('/')}>
      {images.map((props) => <Frame key={props.url} {...props} /> /* prettier-ignore */)}
    </group>
  )
}

function Frame({ url, c = new THREE.Color(), ...props }) {
  const image = useRef()
  const frame = useRef()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const name = getUuid(url)
  const isActive = params?.id === name

  const targetScaleX = !isActive && hovered ? 0.85 * 0.85 : 0.85
  const targetScaleY = !isActive && hovered ? 0.905 * 0.9 : 0.9

  useCursor(hovered)
  useFrame((state, dt) => {
    image.current.material.zoom = 2
    easing.damp3(image.current.scale, [targetScaleX, targetScaleY, 1], 0.1, dt)
  })
  return (
    <group {...props}>
      <mesh name={name} onPointerOver={(e) => (e.stopPropagation(), hover(true))} onPointerOut={() => hover(false)} scale={[0.5, 0.5, 0.02]} position={[0, 1, 2]}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
    </group>
  )
}

function ShelfProducts(side) {
  const hello = side ? 1 : 0
  const boxScale = [0.4, 0.4, 0.02]
  const boxRotation = [0, -Math.PI / 2, 0]

  const numRows = 26 // Define the number of rows
  const numCols = 3 // Define the number of columns
  const spacing = 0.5 // Define the spacing between boxes

  const correctX = -0.9
  const closestZ = 5
  const highestY = 1.3

  const boxes = []

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const y = highestY - j * spacing
      const z = closestZ - i * spacing

      boxes.push(<SimpleBox key={`${i}-${j}`} position={[correctX, y, z]} rotation={boxRotation} scale={boxScale} />)
    }
  }

  return <group>{boxes}</group>
}
