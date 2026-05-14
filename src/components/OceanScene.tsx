import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera, Environment, Text, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function OceanBackground() {
  return (
    <>
      <color attach="background" args={['#02040a']} />
      <fog attach="fog" args={['#02040a', 0, 15]} />
      <Sparkles count={200} scale={20} size={2} speed={0.4} opacity={0.1} color="#3b82f6" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
}

function Submarine() {
  const mesh = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
      mesh.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={mesh}>
        {/* Simple stylized submarine body */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.5, 1.5, 4, 16]} />
          <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Windows */}
        <mesh position={[0, 0.2, 0.8]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={2} transparent opacity={0.6} />
        </mesh>
        {/* Propeller area */}
        <mesh position={[0, 0, -1]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1e40af" />
        </mesh>
      </group>
    </Float>
  );
}

function LightRays() {
  return (
    <group>
      <spotLight
        position={[0, 10, 0]}
        angle={0.15}
        penumbra={1}
        intensity={2}
        castShadow
        color="#3b82f6"
      />
      <ambientLight intensity={0.1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1e40af" />
    </group>
  );
}

export default function OceanScene() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10 pointer-events-none">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
        <OceanBackground />
        <LightRays />
        <Submarine />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2} 
          minPolarAngle={Math.PI / 4} 
        />
      </Canvas>
    </div>
  );
}
