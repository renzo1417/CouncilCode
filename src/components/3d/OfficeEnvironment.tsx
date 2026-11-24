'use client';

import React from 'react';
import { ENTRANCE_DOOR_POS } from '@/store/councilStore';

export const OfficeEnvironment: React.FC = () => {
  return (
    <group>
      {/* =========================================================================
          1. SCANDINAVIAN BLONDE OAK PLINTH (Main Diorama Base)
      ========================================================================= */}
      {/* Beveled Foundation Base (Warm Off-White Stone / Plaster) */}
      <mesh position={[0, -0.32, 0]} receiveShadow>
        <boxGeometry args={[15.6, 0.44, 12.6]} />
        <meshStandardMaterial
          color="#EFECE6"
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Main Blonde Oak Hardwood Floorboard Slab */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[15.0, 0.14, 12.0]} />
        <meshStandardMaterial
          color="#E5D9C5"
          roughness={0.45}
          metalness={0.08}
        />
      </mesh>

      {/* Inset Wool / Felt Acoustic Rug under Critic Pods */}
      <mesh position={[0, 0.012, -1.8]} receiveShadow>
        <boxGeometry args={[9.4, 0.015, 3.8]} />
        <meshStandardMaterial
          color="#DFD8CE"
          roughness={0.85}
          metalness={0.02}
        />
      </mesh>

      {/* Inset Circular Wool Felt Mat under Arbiter Round Table */}
      <mesh position={[0, 0.013, 3.2]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.2, 0.015, 48]} />
        <meshStandardMaterial
          color="#D8CFBF"
          roughness={0.9}
        />
      </mesh>

      {/* Inlaid Delicate Brushed Brass Floor Guides (Station Flow) */}
      {/* Route from Coder to Central Arbiter */}
      <mesh position={[-2.3, 0.022, 1.5]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[4.2, 0.005, 0.03]} />
        <meshStandardMaterial color="#D97706" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Route from Central Arbiter to Sandbox */}
      <mesh position={[2.4, 0.022, 1.8]} rotation={[0, Math.PI / 5, 0]}>
        <boxGeometry args={[4.6, 0.005, 0.03]} />
        <meshStandardMaterial color="#D97706" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Connecting Arc around Critic Pods */}
      <mesh position={[0, 0.022, -0.1]}>
        <boxGeometry args={[7.8, 0.005, 0.03]} />
        <meshStandardMaterial color="#D97706" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* =========================================================================
          2. TERRACOTTA ARCHITECTURAL FEATURE WALL & CONSERVATORY GLASS
      ========================================================================= */}
      {/* Rear Terracotta Plaster Half-Wall */}
      <group position={[0, 1.2, -5.9]}>
        {/* Lower Solid Terracotta Brick / Plaster Foundation */}
        <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[15.0, 1.6, 0.28]} />
          <meshStandardMaterial
            color="#D97059" // Warm Matte Terracotta
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>

        {/* Oak Wooden Sill Rail */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[15.1, 0.08, 0.38]} />
          <meshStandardMaterial color="#CBBBA4" roughness={0.4} />
        </mesh>

        {/* Conservatory Mullions & Warm Sun-Glass Windows */}
        {[-5.0, -2.5, 0, 2.5, 5.0].map((x, idx) => (
          <group key={idx} position={[x, 1.35, 0]}>
            {/* Vertical Mullion */}
            <mesh castShadow>
              <boxGeometry args={[0.08, 1.8, 0.12]} />
              <meshStandardMaterial color="#4A3F35" roughness={0.5} />
            </mesh>
            {/* Translucent Conservatory Glass Panel */}
            <mesh position={[1.25, 0, 0]}>
              <boxGeometry args={[2.42, 1.76, 0.02]} />
              <meshStandardMaterial
                color="#FFFDF7"
                transparent
                opacity={0.2}
                roughness={0.15}
                metalness={0.1}
              />
            </mesh>
          </group>
        ))}

        {/* Top Header Lintel Beam */}
        <mesh position={[0, 2.26, 0]} castShadow>
          <boxGeometry args={[15.1, 0.12, 0.24]} />
          <meshStandardMaterial color="#4A3F35" roughness={0.5} />
        </mesh>
      </group>

      {/* Left Wall with Sliding Studio Entrance Portal */}
      <group position={[-7.4, 1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Wall section */}
        <mesh position={[1.5, -0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.8, 1.6, 0.28]} />
          <meshStandardMaterial
            color="#D97059"
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[1.5, 0.42, 0]} castShadow>
          <boxGeometry args={[8.9, 0.08, 0.38]} />
          <meshStandardMaterial color="#CBBBA4" roughness={0.4} />
        </mesh>
      </group>

      {/* =========================================================================
          3. STUDIO ENTRANCE & WELCOME THRESHOLD (Entrance Door)
      ========================================================================= */}
      <group position={ENTRANCE_DOOR_POS}>
        {/* Oak Door Frame */}
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[0.16, 2.6, 1.5]} />
          <meshStandardMaterial color="#5C4D3C" roughness={0.5} />
        </mesh>
        {/* Frosted Ribbed Glass Door */}
        <mesh position={[0, 1.3, -0.2]}>
          <boxGeometry args={[0.04, 2.45, 1.1]} />
          <meshStandardMaterial
            color="#FFFBF0"
            transparent
            opacity={0.35}
            roughness={0.25}
          />
        </mesh>
        {/* Warm Ceramic Welcome Threshold Mat */}
        <mesh position={[0.45, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 1.2]} />
          <meshStandardMaterial
            color="#C4B5A5"
            roughness={0.8}
          />
        </mesh>
      </group>

      {/* =========================================================================
          4. SCANDINAVIAN MODULAR SHELVING UNIT (With Clay Models & Books)
      ========================================================================= */}
      <group position={[4.5, 1.35, -5.65]}>
        {/* 3 Floating Oak Shelves */}
        {[0, 0.55, 1.1].map((y, idx) => (
          <group key={idx} position={[0, y, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2.6, 0.05, 0.32]} />
              <meshStandardMaterial color="#CBBBA4" roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* Shelf Props: Miniature Architectural Clay Blocks & Books */}
        {/* Clay Cube Model */}
        <mesh position={[-0.8, 0.16, 0]} castShadow>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial color="#FAF8F5" roughness={0.4} />
        </mesh>
        {/* Miniature Glazed Ceramic Vase */}
        <mesh position={[-0.3, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.05, 0.22, 20]} />
          <meshStandardMaterial color="#D97059" roughness={0.3} />
        </mesh>
        {/* Stack of Architectural Review Folios */}
        <mesh position={[0.6, 0.1, 0]} castShadow>
          <boxGeometry args={[0.34, 0.12, 0.26]} />
          <meshStandardMaterial color="#E2DCD4" roughness={0.6} />
        </mesh>

        {/* Upper Shelf: Potted Trailing Ivy Plant */}
        <group position={[0.7, 0.72, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.07, 0.18, 16]} />
            <meshStandardMaterial color="#FAF8F5" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.12, 0]} castShadow>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color="#4E7D63" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* =========================================================================
          5. BOTANICAL GREENERY (Fiddle-Leaf & Monstera Plants)
      ========================================================================= */}
      {/* Corner Monstera Plant in Terracotta Planter */}
      <group position={[6.2, 0, -4.6]}>
        {/* Glazed Ceramic Planter */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.38, 0.28, 0.9, 24]} />
          <meshStandardMaterial color="#F2EDE4" roughness={0.3} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.04, 20]} />
          <meshStandardMaterial color="#3E342B" roughness={0.9} />
        </mesh>
        {/* Lush Stylized Ceramic Leaves */}
        <mesh position={[0.1, 1.4, 0.1]} rotation={[0.3, 0.4, 0.2]} castShadow>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshStandardMaterial color="#3B6B52" roughness={0.6} />
        </mesh>
        <mesh position={[-0.15, 1.25, -0.1]} rotation={[-0.3, -0.5, -0.2]} castShadow>
          <sphereGeometry args={[0.36, 16, 16]} />
          <meshStandardMaterial color="#4E7D63" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.75, 0]} rotation={[0.1, 0.8, -0.1]} castShadow>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color="#5E9374" roughness={0.6} />
        </mesh>
      </group>

      {/* Plant near Entrance Door */}
      <group position={[-5.4, 0, 4.4]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.2, 0.64, 20]} />
          <meshStandardMaterial color="#D97059" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.78, 0]} castShadow>
          <sphereGeometry args={[0.3, 14, 14]} />
          <meshStandardMaterial color="#4E7D63" roughness={0.6} />
        </mesh>
      </group>

      {/* =========================================================================
          6. COZY ESPRESSO BAR NOOK
      ========================================================================= */}
      <group position={[-5.6, 0, -4.5]}>
        {/* Blonde Oak Bar Cabinet */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 1.0, 0.75]} />
          <meshStandardMaterial color="#CBBBA4" roughness={0.4} />
        </mesh>
        {/* Ceramic Stone Countertop */}
        <mesh position={[0, 1.02, 0]} castShadow>
          <boxGeometry args={[1.78, 0.05, 0.82]} />
          <meshStandardMaterial color="#F4EFEA" roughness={0.2} />
        </mesh>
        {/* Retro Matte Ceramic Espresso Machine */}
        <group position={[-0.32, 1.25, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.44, 0.42, 0.36]} />
            <meshStandardMaterial color="#3E444D" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Portafilter & Dispenser */}
          <mesh position={[0, -0.08, 0.2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.1, 16]} />
            <meshStandardMaterial color="#D97706" metalness={0.8} />
          </mesh>
        </group>
        {/* Pastel Ceramic Coffee Mugs */}
        <mesh position={[0.22, 1.1, 0.06]} castShadow>
          <cylinderGeometry args={[0.045, 0.038, 0.09, 16]} />
          <meshStandardMaterial color="#D97059" roughness={0.3} />
        </mesh>
        <mesh position={[0.38, 1.1, -0.06]} castShadow>
          <cylinderGeometry args={[0.045, 0.038, 0.09, 16]} />
          <meshStandardMaterial color="#4E7D63" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
