'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

// Cores da marca — índigo e laranja, baixa opacidade (fios de linha, não protagonismo).
const THREAD_COLORS = ['#2a2d7c', '#3538a0', '#e8642c']

const THREAD_COUNT = 11

interface Thread {
  points: THREE.Vector3[]
  color: string
  opacity: number
  speed: number
  phase: number
}

function buildThreads(): Thread[] {
  const threads: Thread[] = []
  for (let i = 0; i < THREAD_COUNT; i++) {
    const y = -3.6 + (i / (THREAD_COUNT - 1)) * 7.2
    const amp = 0.5 + Math.random() * 0.9
    const freq = 0.6 + Math.random() * 0.8
    const phase = Math.random() * Math.PI * 2
    const points: THREE.Vector3[] = []
    const segments = 40
    for (let s = 0; s <= segments; s++) {
      const t = s / segments
      const x = -8 + t * 16
      const wobble = Math.sin(t * Math.PI * freq * 2 + phase) * amp
      points.push(new THREE.Vector3(x, y + wobble, -(i % 4) * 0.35))
    }
    threads.push({
      points,
      color: THREAD_COLORS[i % THREAD_COLORS.length],
      opacity: 0.12 + Math.random() * 0.16,
      speed: 0.15 + Math.random() * 0.2,
      phase,
    })
  }
  return threads
}

function Threads() {
  const threads = useMemo(() => buildThreads(), [])
  const groupRef = useRef<THREE.Group>(null)
  const pointer = useThree((st) => st.pointer)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    // Deslocamento sutil reagindo ao ponteiro — nada brusco.
    const targetRotX = pointer.y * 0.08
    const targetRotY = pointer.x * 0.12
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.04
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.04
    groupRef.current.position.x += (pointer.x * 0.3 - groupRef.current.position.x) * 0.03
    groupRef.current.position.y += (pointer.y * 0.2 - groupRef.current.position.y) * 0.03
    groupRef.current.position.y += Math.sin(t * 0.08) * 0.0008
  })

  return (
    <group ref={groupRef}>
      {threads.map((thread, i) => (
        <Line
          key={i}
          points={thread.points}
          color={thread.color}
          lineWidth={1}
          transparent
          opacity={thread.opacity}
        />
      ))}
    </group>
  )
}

export default function ThreadField() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Threads />
    </Canvas>
  )
}
