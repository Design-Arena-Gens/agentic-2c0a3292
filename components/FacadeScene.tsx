"use client";
import { useMemo } from 'react';
import { GroupProps } from '@react-three/fiber';
import { Box, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function FacadeScene(props: GroupProps) {
  const concrete = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#b7b8bb'),
    roughness: 0.9,
    metalness: 0.05
  }), []);

  const wood = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#8a5a3b'),
    roughness: 0.8,
    metalness: 0.05
  }), []);

  const metal = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#b0b6be'),
    roughness: 0.2,
    metalness: 0.9
  }), []);

  const ledEmissive = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color('#b0d8ff')
  }), []);

  const groundMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#20252b'),
    roughness: 1,
    metalness: 0
  }), []);

  return (
    <group {...props}>
      {/* Ground */}
      <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <primitive object={groundMat} attach="material" />
      </mesh>

      {/* Sunlight */}
      <directionalLight
        castShadow
        position={[8, 14, 6]}
        intensity={1.7}
        color={new THREE.Color('#fff8e5')}
        shadow-mapSize={[2048, 2048]}
      />
      <hemisphereLight args={[0xffffff, 0x223344, 0.2]} />

      {/* Building base volume */}
      <group position={[0, 2.2, 0]}>
        {/* Main concrete box */}
        <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
          <boxGeometry args={[10, 4, 4]} />
          <primitive object={concrete} attach="material" />
        </mesh>

        {/* Upper floating white volume (metal) */}
        <mesh castShadow receiveShadow position={[1.2, 3.4, 0.2]}>
          <boxGeometry args={[6, 2.2, 3.2]} />
          <primitive object={metal} attach="material" />
        </mesh>

        {/* Recessed wood panels */}
        {[ -2.8, 0, 2.8 ].map((x, i) => (
          <mesh key={i} castShadow receiveShadow position={[x, 1.2, 1.95]}>
            <boxGeometry args={[2.6, 3.2, 0.1]} />
            <primitive object={wood} attach="material" />
          </mesh>
        ))}

        {/* Glass windows - physically based transmission */}
        <group position={[0, 1.7, -2.05]}>
          {[ -3.2, 0, 3.2 ].map((x, i) => (
            <mesh key={i} castShadow position={[x, 0, 0]}>
              <boxGeometry args={[2.4, 2.2, 0.04]} />
              <MeshTransmissionMaterial
                thickness={0.4}
                chromaticAberration={0.02}
                anisotropicBlur={0.1}
                transmission={1}
                roughness={0.08}
                ior={1.5}
                attenuationColor="#9ec7ff"
                attenuationDistance={3}
                backside={true}
              />
            </mesh>
          ))}
        </group>

        {/* Vertical fins in front of glass */}
        <group position={[0, 1.7, -1.8]}>
          {Array.from({ length: 17 }).map((_, i) => {
            const x = -8 + i * 1; // repeat across the facade
            return (
              <mesh key={i} castShadow position={[x * 0.5, 0, 0]}>
                <boxGeometry args={[0.06, 2.5, 0.3]} />
                <primitive object={metal} attach="material" />
              </mesh>
            );
          })}
        </group>

        {/* Subtle linear LED strips under slabs */}
        <group position={[0, 0.1, 2.02]}>
          {[0.0, 2.3, 4.6].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <boxGeometry args={[9.4, 0.02, 0.02]} />
              <primitive object={ledEmissive} attach="material" />
            </mesh>
          ))}
        </group>

        {/* Additional geometric boxes to articulate depth */}
        <mesh castShadow receiveShadow position={[-3.8, 2.0, 1.6]}>
          <boxGeometry args={[1.6, 1.6, 1.6]} />
          <primitive object={concrete} attach="material" />
        </mesh>
        <mesh castShadow receiveShadow position={[3.6, 0.8, -1.4]}>
          <boxGeometry args={[1.2, 2.0, 1.2]} />
          <primitive object={metal} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
