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
  const worldWidth = width ?? (isAction ? 0.82 : 1.25);
  const worldHeight = height ?? (isAction ? 0.2 : 0.28);

  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null;

    const canvasWidth = isAction ? 400 : 560;
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

    let bgColor = 'rgba(255, 255, 255, 0.94)';
    let borderColor = 'rgba(212, 209, 202, 0.95)';
    let borderWidth = 2.5;
    let titleColor = '#141413';
    let tagBg = statusTagBg || 'rgba(242, 241, 238, 0.95)';
    let tagText = statusTagText || '#575550';

    if (isAction) {
      bgColor = 'rgba(255, 255, 255, 0.95)';
      borderColor = '#D4D1CA';
      borderWidth = 2.5;
      titleColor = '#141413';
    } else if (isAlert) {
      bgColor = 'rgba(254, 242, 242, 0.97)';
      borderColor = '#DC2626';
      borderWidth = 3.5;
      titleColor = '#991B1B';
      tagBg = 'rgba(254, 226, 226, 0.95)';
      tagText = '#991B1B';
    } else if (isSelected) {
      bgColor = 'rgba(20, 20, 19, 0.96)';
      borderColor = '#141413';
      borderWidth = 3;
      titleColor = '#FFFFFF';
      tagBg = 'rgba(255, 255, 255, 0.16)';
      tagText = '#F6F5F2';
    }

    drawPill(ctx, pillX, pillY, pillW, pillH, radius);
    ctx.fillStyle = bgColor;
    ctx.fill();

    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();

    const sansFamily = '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    if (isAction) {
      ctx.font = `600 28px ${sansFamily}`;
      ctx.fillStyle = titleColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, canvasWidth / 2, canvasHeight / 2);
    } else {
      const centerY = canvasHeight / 2;

      let titleStartX = 34;
      if (dotColor) {
        const dotX = 42;
        const dotRadius = 10;
        ctx.beginPath();
        ctx.arc(dotX, centerY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = isAlert ? '#DC2626' : dotColor;
        ctx.fill();

        titleStartX = 64;
      }

      let tagLeftX = canvasWidth - 20;
      if (subtitle) {
        ctx.font = `500 22px ${sansFamily}`;
        const formattedSub = subtitle.charAt(0).toUpperCase() + subtitle.slice(1);
        const tagTextWidth = ctx.measureText(formattedSub).width;
        const tagPadX = 16;
        const tagW = Math.max(tagTextWidth + tagPadX * 2, 76);
        const tagH = 42;
        tagLeftX = canvasWidth - tagW - 20;
        const tagY = (canvasHeight - tagH) / 2;

        drawPill(ctx, tagLeftX, tagY, tagW, tagH, tagH / 2);
        ctx.fillStyle = tagBg;
        ctx.fill();

        ctx.fillStyle = tagText;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(formattedSub, tagLeftX + tagW / 2, centerY + 1);
      }

      const maxTitleW = tagLeftX - titleStartX - 16;
      ctx.font = `600 27px ${sansFamily}`;
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
        scale={hovered ? [1.06, 1.06, 1] : [1, 1, 1]}
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
