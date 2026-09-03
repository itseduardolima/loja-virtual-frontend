'use client'

import { useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Float, Line } from '@react-three/drei'
import * as THREE from 'three'

// Cores da marca — índigo e laranja, baixa opacidade (etiquetas flutuando, não protagonismo).
const TAG_COLORS = ['#2a2d7c', '#3538a0', '#e8642c']

// Contorno da etiqueta de roupa — mesmo desenho usado como motivo da marca no protótipo,
// traduzido de path SVG (viewBox 140×160) pra um THREE.Shape, escala /100.
function buildTagOutline(): THREE.Vector3[] {
  const shape = new THREE.Shape()
  shape.moveTo(0.78, 0.08)
  shape.bezierCurveTo(0.64, 0.08, 0.61, 0.11, 0.53, 0.2)
  shape.lineTo(0.14, 0.62)
  shape.bezierCurveTo(0.08, 0.68, 0.08, 0.76, 0.14, 0.82)
  shape.lineTo(0.58, 1.26)
  shape.bezierCurveTo(0.64, 1.32, 0.72, 1.32, 0.78, 1.26)
  shape.lineTo(1.2, 0.84)
  shape.bezierCurveTo(1.26, 0.78, 1.29, 0.7, 1.29, 0.61)
  shape.lineTo(1.29, 0.2)
  shape.bezierCurveTo(1.29, 0.13, 1.24, 0.08, 1.17, 0.08)
  shape.closePath()

  const cx = 0.685
  const cy = 0.7
  return shape.getPoints(28).map((p) => new THREE.Vector3(p.x - cx, -(p.y - cy), 0))
}

function buildHoleOutline(): THREE.Vector3[] {
  const cx = 1.03 - 0.685
  const cy = -(0.34 - 0.7)
  const r = 0.07
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2
    pts.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0))
  }
  return pts
}

interface TagDef {
  position: [number, number, number]
  rotationZ: number
  scale: number
  color: string
  opacity: number
  floatSpeed: number
  floatIntensity: number
  rotationIntensity: number
}

// Distribui as etiquetas por todo o campo de visão do canvas (fixo pra viewport inteira).
function buildTags(spreadWidth: number, spreadHeight: number): TagDef[] {
  const count = Math.min(40, Math.max(14, Math.round(spreadHeight * 1.3)))
  const tags: TagDef[] = []
  for (let i = 0; i < count; i++) {
    tags.push({
      position: [
        (Math.random() - 0.5) * spreadWidth,
        (Math.random() - 0.5) * spreadHeight,
        (Math.random() - 0.5) * 3 - 0.5,
      ],
      rotationZ: (Math.random() - 0.5) * 0.7 - 0.15,
      scale: 0.6 + Math.random() * 0.8,
      color: TAG_COLORS[i % TAG_COLORS.length],
      opacity: 0.1 + Math.random() * 0.13,
      floatSpeed: 0.5 + Math.random() * 0.7,
      floatIntensity: 0.6 + Math.random() * 0.9,
      rotationIntensity: 0.3 + Math.random() * 0.4,
    })
  }
  return tags
}

function TagMesh({
  tag,
  outline,
  hole,
}: {
  tag: TagDef
  outline: THREE.Vector3[]
  hole: THREE.Vector3[]
}) {
  return (
    <Float
      speed={tag.floatSpeed}
      floatIntensity={tag.floatIntensity}
      rotationIntensity={tag.rotationIntensity}
    >
      <group position={tag.position} rotation={[0, 0, tag.rotationZ]} scale={tag.scale}>
        <Line points={outline} color={tag.color} lineWidth={1} transparent opacity={tag.opacity} />
        <Line points={hole} color={tag.color} lineWidth={1} transparent opacity={tag.opacity} />
      </group>
    </Float>
  )
}

function Tags() {
  const viewport = useThree((st) => st.viewport)
  const outline = useMemo(() => buildTagOutline(), [])
  const hole = useMemo(() => buildHoleOutline(), [])
  const tags = useMemo(
    () => buildTags(viewport.width, viewport.height),
    [viewport.width, viewport.height]
  )

  return (
    <>
      {tags.map((tag, i) => (
        <TagMesh key={i} tag={tag} outline={outline} hole={hole} />
      ))}
    </>
  )
}

export default function ThreadField() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      orthographic
      camera={{ position: [0, 0, 10], zoom: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Tags />
    </Canvas>
  )
}
