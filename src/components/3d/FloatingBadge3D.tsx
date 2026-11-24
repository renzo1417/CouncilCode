'use client';

import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';

export interface FloatingBadge3DProps {
  position?: [number, number, number];
  title: string;
  subtitle?: string;
  dotColor?: string;
  variant?: 'badge' | 'action';
  isSelected?: boolean;
  isAlert?: boolean;
  statusTagBg?: string;
  statusTagText?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}

function drawPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.lineTo(x + radius, y + h);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }
}

export const FloatingBadge3D: React.FC<FloatingBadge3DProps> = ({
  position = [0, 0, 0],
  title,
  subtitle,
  dotColor,
  variant = 'badge',
  isSelected = false,
  isAlert = false,
  statusTagBg,
  statusTagText,
  width,
  height,
  onClick
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const isAction = variant === 'action';
  const worldWidth = width ?? (isAction ? 0.72 : 1.25);
  const worldHeight = height ?? (isAction ? 0.2 : 0.28);

  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null;

    const canvasWidth = isAction ? 360 : 560;
    const canvasHeight = isAction ? 100 : 124;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const pillX = 6;
    const pillY = 6;
    const pillW = canvasWidth - 12;
    const pillH = canvasHeight - 12;
    const radius = pillH / 2;

    // Background & Border styling
    let bgColor = 'rgba(250, 248, 245, 0.95)';
    let borderColor = 'rgba(214, 211, 209, 0.95)';
    let borderWidth = 3.5;
    let titleColor = '#1C1917';
    let tagBg = statusTagBg || 'rgba(231, 229, 228, 0.85)';
    let tagText = statusTagText || '#57534E';

    if (isAction) {
      bgColor = 'rgba(255, 251, 235, 0.95)';
      borderColor = 'rgba(245, 158, 11, 0.9)';
      borderWidth = 3.5;
      titleColor = '#78350F';
    } else if (isAlert) {
      bgColor = 'rgba(69, 10, 10, 0.95)';
      borderColor = '#F87171';
      borderWidth = 4.5;
      titleColor = '#FEE2E2';
      tagBg = 'rgba(239, 68, 68, 0.35)';
      tagText = '#FECACA';
    } else if (isSelected) {
      bgColor = 'rgba(24, 24, 27, 0.96)';
      borderColor = '#F59E0B';
      borderWidth = 4.5;
      titleColor = '#FFFFFF';
      tagBg = 'rgba(255, 255, 255, 0.18)';
      tagText = '#FDE68A';
    }

    // Outer glow for selected or alert
    if (isSelected || isAlert) {
      ctx.save();
      ctx.shadowColor = isAlert ? 'rgba(239, 68, 68, 0.45)' : 'rgba(245, 158, 11, 0.45)';
      ctx.shadowBlur = 12;
      drawPill(ctx, pillX, pillY, pillW, pillH, radius);
      ctx.fillStyle = bgColor;
      ctx.fill();
      ctx.restore();
    } else {
      drawPill(ctx, pillX, pillY, pillW, pillH, radius);
      ctx.fillStyle = bgColor;
      ctx.fill();
    }

    // Border
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();

    if (isAction) {
      // Action badge (e.g. + Desk #4)
      ctx.font = 'bold 30px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = titleColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, canvasWidth / 2, canvasHeight / 2);
    } else {
      // Regular badge with dot, title, and optional subtitle tag
      const centerY = canvasHeight / 2;

      // Status dot
      let titleStartX = 34;
      if (dotColor) {
        const dotX = 42;
        const dotRadius = 11;
        ctx.beginPath();
        ctx.arc(dotX, centerY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = isAlert ? '#EF4444' : dotColor;
        ctx.fill();

        // Subtle inner ring on dot
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.stroke();

        titleStartX = 66;
      }

      // Subtitle status tag (on right)
      let tagLeftX = canvasWidth - 20;
      if (subtitle) {
        ctx.font = 'bold 20px ui-monospace, SFMono-Regular, Menlo, monospace';
        const subUpper = subtitle.toUpperCase();
        const tagTextWidth = ctx.measureText(subUpper).width;
        const tagPadX = 14;
        const tagW = Math.max(tagTextWidth + tagPadX * 2, 70);
        const tagH = 42;
        tagLeftX = canvasWidth - tagW - 20;
        const tagY = (canvasHeight - tagH) / 2;

        drawPill(ctx, tagLeftX, tagY, tagW, tagH, 8);
        ctx.fillStyle = tagBg;
        ctx.fill();

        ctx.fillStyle = tagText;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(subUpper, tagLeftX + tagW / 2, centerY + 1);
      }

      // Title text (in middle)
      const maxTitleW = tagLeftX - titleStartX - 16;
      ctx.font = '600 27px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = titleColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      let displayTitle = title;
      if (ctx.measureText(displayTitle).width > maxTitleW) {
        while (displayTitle.length > 3 && ctx.measureText(displayTitle + '…').width > maxTitleW) {
          displayTitle = displayTitle.slice(0, -1);
        }
        displayTitle += '…';
      }
      ctx.fillText(displayTitle, titleStartX, centerY);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
    return tex;
  }, [
    title,
    subtitle,
    dotColor,
    isAction,
    isSelected,
    isAlert,
    statusTagBg,
    statusTagText
  ]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  useEffect(() => {
    return () => {
      if (hovered) {
        document.body.style.cursor = 'auto';
      }
    };
  }, [hovered]);

  useFrame((state) => {
    if (isAlert && meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 7) * 0.04;
    } else if (meshRef.current && meshRef.current.position.y !== 0) {
      meshRef.current.position.y = 0;
    }
  });

  return (
    <Billboard position={position} follow lockX={false} lockY={false} lockZ={false}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
          setHovered(false);
        }}
        scale={hovered ? [1.08, 1.08, 1] : [1, 1, 1]}
      >
        <planeGeometry args={[worldWidth, worldHeight]} />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            transparent
            toneMapped={false}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        )}
      </mesh>
    </Billboard>
  );
};
