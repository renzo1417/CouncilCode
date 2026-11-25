'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface VerificationCanvasModelProps {
  variant: 'pipeline' | 'pods';
  mode?: 'solo' | 'teams';
  activeStep?: number;
  isPlaying?: boolean;
  highlightStages?: 'pipeline' | 'four-stages';
  heightClass?: string;
}

function cubicPoint(
  t: number,
  x0: number,
  y0: number,
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  x1: number,
  y1: number
): [number, number] {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  return [
    uuu * x0 + 3 * uu * t * cx1 + 3 * u * tt * cx2 + ttt * x1,
    uuu * y0 + 3 * uu * t * cy1 + 3 * u * tt * cy2 + ttt * y1
  ];
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export const VerificationCanvasModel: React.FC<VerificationCanvasModelProps> = ({
  variant,
  mode = 'solo',
  activeStep = 0,
  isPlaying = true,
  highlightStages = 'pipeline',
  heightClass
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let startTs = performance.now();

    const renderFrame = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const compact = w < 560;
      const elapsed = prefersReduced || !isPlaying ? 1.4 : (now - startTs) / 1000;

      // Clean dark anodized canvas ground
      ctx.fillStyle = '#181816';
      ctx.fillRect(0, 0, w, h);

      // Subtle architectural dot grid
      ctx.fillStyle = 'rgba(245, 245, 244, 0.06)';
      const spacing = 24;
      for (let gx = spacing / 2; gx < w; gx += spacing) {
        for (let gy = spacing / 2; gy < h; gy += spacing) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const fontFamily = getComputedStyle(document.body).fontFamily || 'sans-serif';

      const drawNode = (
        cx: number,
        cy: number,
        bw: number,
        bh: number,
        title: string,
        sub: string,
        highlight: boolean,
        accent: 'neutral' | 'green' | 'red' = 'neutral'
      ) => {
        drawRoundedRect(ctx, cx - bw / 2, cy - bh / 2, bw, bh, 10);
        ctx.fillStyle = highlight ? '#262623' : '#1D1D1A';
        ctx.fill();
        ctx.lineWidth = highlight ? 1.6 : 1;
        ctx.strokeStyle =
          accent === 'green'
            ? highlight
              ? 'rgba(74, 222, 128, 0.95)'
              : 'rgba(74, 222, 128, 0.45)'
            : accent === 'red'
            ? highlight
              ? 'rgba(252, 165, 165, 0.8)'
              : 'rgba(252, 165, 165, 0.35)'
            : highlight
            ? 'rgba(245, 245, 244, 0.65)'
            : 'rgba(245, 245, 244, 0.14)';
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#F5F5F4';
        ctx.font = `600 ${compact ? 11.5 : 13}px ${fontFamily}`;
        ctx.fillText(title, cx, sub ? cy - 8 : cy);

        if (sub) {
          ctx.fillStyle = accent === 'green' ? '#4ADE80' : '#B5B3AD';
          ctx.font = `500 ${compact ? 10 : 11}px ${fontFamily}`;
          ctx.fillText(sub, cx, cy + 8.5);
        }
      };

      const drawBezierH = (
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        active: boolean,
        color: string,
        pulseT: number | null,
        dashed = false
      ) => {
        const dx = (x1 - x0) * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.bezierCurveTo(x0 + dx, y0, x1 - dx, y1, x1, y1);
        ctx.lineWidth = active ? 2 : 1.25;
        ctx.strokeStyle = active ? color : 'rgba(245, 245, 244, 0.16)';
        if (dashed) ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.restore();

        if (pulseT !== null) {
          const [px, py] = cubicPoint(pulseT, x0, y0, x0 + dx, y0, x1 - dx, y1, x1, y1);
          ctx.beginPath();
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      };

      const drawBezierV = (
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        active: boolean,
        color: string,
        pulseT: number | null,
        dashed = false
      ) => {
        const dy = (y1 - y0) * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.bezierCurveTo(x0, y0 + dy, x1, y1 - dy, x1, y1);
        ctx.lineWidth = active ? 1.8 : 1.2;
        ctx.strokeStyle = active ? color : 'rgba(245, 245, 244, 0.16)';
        if (dashed) ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.restore();

        if (pulseT !== null) {
          const [px, py] = cubicPoint(pulseT, x0, y0, x0, y0 + dy, x1, y1 - dy, x1, y1);
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      };

      const isPodsView = variant === 'pods' || mode === 'teams';
      const fourStages = highlightStages === 'four-stages';
      const t1 = (elapsed * 0.6) % 1;
      const t2 = (elapsed * 0.6 + 0.33) % 1;
      const t3 = (elapsed * 0.6 + 0.66) % 1;

      const diffHighlight = fourStages ? activeStep === 0 : activeStep === 0;
      const sandboxHighlight = fourStages ? activeStep === 0 : activeStep === 1;
      const modelsHighlight = fourStages ? activeStep === 1 : activeStep === 2;
      const gateHighlight = fourStages ? activeStep === 2 : activeStep === 2;
      const prHighlight = fourStages ? activeStep === 3 : activeStep === 3;

      const railDiffActive = fourStages ? activeStep >= 0 : activeStep >= 0;
      const railJuryActive = fourStages ? activeStep >= 1 : activeStep >= 1;
      const railGateActive = fourStages ? activeStep >= 2 : activeStep >= 2;

      if (!isPodsView && !compact) {
        // Desktop / Tablet Horizontal Solo Pipeline
        const xDiff = w * 0.10;
        const xSandbox = w * 0.31;
        const xModels = w * 0.56;
        const xGate = w * 0.74;
        const xPr = w * 0.90;
        const midY = h * 0.5;
        const modelYs = [h * 0.23, h * 0.5, h * 0.77];

        const nodeW = Math.min(118, w * 0.14);
        const nodeH = 46;
        const mW = Math.min(110, w * 0.13);
        const mH = 38;

        drawBezierH(xDiff + nodeW / 2, midY, xSandbox - nodeW / 2, midY, railDiffActive, '#F5F5F4', t1);
        modelYs.forEach((my, idx) => {
          drawBezierH(xSandbox + nodeW / 2, midY, xModels - mW / 2, my, railJuryActive, '#F5F5F4', (t2 + idx * 0.12) % 1);
        });

        // Vertical Proof Gate line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xGate, h * 0.14);
        ctx.lineTo(xGate, h * 0.86);
        ctx.lineWidth = gateHighlight ? 2.2 : 1.25;
        ctx.strokeStyle = railGateActive ? 'rgba(74, 222, 128, 0.85)' : 'rgba(245, 245, 244, 0.25)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.fillStyle = railGateActive ? '#4ADE80' : '#B5B3AD';
        ctx.font = `600 11px ${fontFamily}`;
        ctx.fillText('Proof gate', xGate, h * 0.08);

        drawBezierH(xModels + mW / 2, modelYs[0], xPr - nodeW / 2, midY - 6, railGateActive, '#4ADE80', t3);
        drawBezierH(xModels + mW / 2, modelYs[1], xPr - nodeW / 2, midY + 6, railGateActive, '#4ADE80', (t3 + 0.22) % 1);
        drawBezierH(xModels + mW / 2, modelYs[2], xGate - 6, modelYs[2], railGateActive, '#FCA5A5', (t3 + 0.1) % 1, true);

        ctx.strokeStyle = '#FCA5A5';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(xGate - 4, modelYs[2] - 4);
        ctx.lineTo(xGate + 4, modelYs[2] + 4);
        ctx.moveTo(xGate + 4, modelYs[2] - 4);
        ctx.lineTo(xGate - 4, modelYs[2] + 4);
        ctx.stroke();

        drawNode(xDiff, midY, nodeW, nodeH, 'Your diff', 'CLI / Web', diffHighlight);
        drawNode(xSandbox, midY, nodeW, nodeH, 'Sandbox', '<5s · $0', sandboxHighlight, railDiffActive ? 'green' : 'neutral');
        drawNode(xModels, modelYs[0], mW, mH, 'Model A', 'Failing test', modelsHighlight || gateHighlight, 'green');
        drawNode(xModels, modelYs[1], mW, mH, 'Model B', 'Failing test', modelsHighlight || gateHighlight, 'green');
        drawNode(xModels, modelYs[2], mW, mH, 'Model C', 'No proof', modelsHighlight || gateHighlight, 'red');
        drawNode(xPr, midY, nodeW, nodeH, '1 Green PR', 'Verified', prHighlight, prHighlight ? 'green' : 'neutral');
      } else if (!isPodsView && compact) {
        // Mobile Vertical Solo Pipeline (spacious, zero overlap)
        const midX = w * 0.5;
        const yTop = h * 0.14;
        const yModels = h * 0.48;
        const yGate = h * 0.67;
        const yPr = h * 0.86;
        const modelXs = [w * 0.19, w * 0.5, w * 0.81];
        const mW = Math.min(96, w * 0.28);
        const mH = 40;
        const topW = Math.min(118, w * 0.36);

        const xDiff = w * 0.27;
        const xSand = w * 0.73;
        drawBezierH(xDiff + topW / 2, yTop, xSand - topW / 2, yTop, railDiffActive, '#F5F5F4', t1);

        modelXs.forEach((mx, idx) => {
          drawBezierV(xSand, yTop + 22, mx, yModels - mH / 2, railJuryActive, '#F5F5F4', (t2 + idx * 0.12) % 1);
        });

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(w * 0.08, yGate);
        ctx.lineTo(w * 0.92, yGate);
        ctx.lineWidth = gateHighlight ? 2 : 1.2;
        ctx.strokeStyle = railGateActive ? 'rgba(74, 222, 128, 0.85)' : 'rgba(245, 245, 244, 0.25)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.restore();

        ctx.textAlign = 'left';
        ctx.fillStyle = railGateActive ? '#4ADE80' : '#B5B3AD';
        ctx.font = `600 10px ${fontFamily}`;
        ctx.fillText('Proof gate', w * 0.08, yGate - 7);

        drawBezierV(modelXs[0], yModels + mH / 2, midX - 10, yPr - 22, railGateActive, '#4ADE80', t3);
        drawBezierV(modelXs[1], yModels + mH / 2, midX + 10, yPr - 22, railGateActive, '#4ADE80', (t3 + 0.22) % 1);
        drawBezierV(modelXs[2], yModels + mH / 2, modelXs[2], yGate - 6, railGateActive, '#FCA5A5', (t3 + 0.1) % 1, true);

        ctx.strokeStyle = '#FCA5A5';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(modelXs[2] - 4, yGate - 4);
        ctx.lineTo(modelXs[2] + 4, yGate + 4);
        ctx.moveTo(modelXs[2] + 4, yGate - 4);
        ctx.lineTo(modelXs[2] - 4, yGate + 4);
        ctx.stroke();

        drawNode(xDiff, yTop, topW, 42, 'Your diff', 'CLI / Web', diffHighlight);
        drawNode(xSand, yTop, topW, 42, 'Sandbox', '<5s · $0', sandboxHighlight, railDiffActive ? 'green' : 'neutral');
        drawNode(modelXs[0], yModels, mW, mH, 'Model A', 'Proved', modelsHighlight || gateHighlight, 'green');
        drawNode(modelXs[1], yModels, mW, mH, 'Model B', 'Proved', modelsHighlight || gateHighlight, 'green');
        drawNode(modelXs[2], yModels, mW, mH, 'Model C', 'No proof', modelsHighlight || gateHighlight, 'red');
        drawNode(midX, yPr, 134, 42, '1 Green PR', 'Verified', prHighlight, prHighlight ? 'green' : 'neutral');
      } else if (isPodsView && !compact) {
        // Desktop / Tablet Horizontal Two-Tier Pods
        const xContract = w * 0.12;
        const xPods = w * 0.39;
        const xHigher = w * 0.66;
        const xLinked = w * 0.89;
        const midY = h * 0.5;
        const podYs = [h * 0.27, h * 0.73];

        const nodeW = Math.min(118, w * 0.17);
        const nodeH = 46;
        const pW = Math.min(126, w * 0.19);
        const pH = 42;

        podYs.forEach((py, idx) => {
          drawBezierH(xContract + nodeW / 2, midY, xPods - pW / 2, py, true, '#F5F5F4', (t1 + idx * 0.15) % 1);
          drawBezierH(xPods + pW / 2, py, xHigher - nodeW / 2, midY, true, '#4ADE80', (t2 + idx * 0.15) % 1);
        });
        drawBezierH(xHigher + nodeW / 2, midY, xLinked - nodeW / 2, midY, true, '#4ADE80', t3);

        drawNode(xContract, midY, nodeW, nodeH, 'Contract', 'OpenAPI', variant === 'pods' || activeStep === 0);
        drawNode(xPods, podYs[0], pW, pH, 'Frontend pod', 'Sandbox + jury', variant === 'pods' || activeStep === 1, 'green');
        drawNode(xPods, podYs[1], pW, pH, 'Backend pod', 'Sandbox + jury', variant === 'pods' || activeStep === 1, 'green');
        drawNode(xHigher, midY, nodeW, nodeH, 'Higher council', 'E2E gate', variant === 'pods' || activeStep === 2, 'green');
        drawNode(xLinked, midY, nodeW, nodeH, 'Linked PRs', 'Zero drift', variant === 'pods' || activeStep === 3, 'green');
      } else {
        // Compact / Narrow Two-Tier Pods
        const midX = w * 0.5;
        const yContract = h * 0.16;
        const yPods = h * 0.50;
        const yBottom = h * 0.84;
        const podXs = [w * 0.26, w * 0.74];
        const bXs = [w * 0.26, w * 0.74];
        const cardW = Math.min(138, w * 0.42);
        const cardH = 42;

        podXs.forEach((px, idx) => {
          drawBezierV(midX, yContract + cardH / 2, px, yPods - cardH / 2, true, '#F5F5F4', (t1 + idx * 0.15) % 1);
          drawBezierV(px, yPods + cardH / 2, bXs[0], yBottom - cardH / 2, true, '#4ADE80', (t2 + idx * 0.15) % 1);
        });
        drawBezierH(bXs[0] + cardW / 2, yBottom, bXs[1] - cardW / 2, yBottom, true, '#4ADE80', t3);

        drawNode(midX, yContract, Math.min(168, w * 0.52), cardH, 'Shared contract', 'OpenAPI + Types', true);
        drawNode(podXs[0], yPods, cardW, cardH, 'Frontend pod', 'Sandbox + jury', true, 'green');
        drawNode(podXs[1], yPods, cardW, cardH, 'Backend pod', 'Sandbox + jury', true, 'green');
        drawNode(bXs[0], yBottom, cardW, cardH, 'Higher council', 'E2E gate', true, 'green');
        drawNode(bXs[1], yBottom, cardW, cardH, 'Linked PRs', 'Zero drift', true, 'green');
      }

      ctx.restore();

      if (!prefersReduced && isPlaying) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    startTs = performance.now();
    renderFrame(startTs);

    const onResize = () => renderFrame(performance.now());
    window.addEventListener('resize', onResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [variant, mode, activeStep, isPlaying, highlightStages, prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={
        variant === 'pods' || mode === 'teams'
          ? 'Animated diagram showing shared contract lock feeding parallel frontend and backend pods into the Higher Council and linked pull requests'
          : 'Animated diagram showing code diff passing through the deterministic sandbox gate and competing model jury into the Proof Gate where unproved opinions are blocked and proved bugs become one green pull request'
      }
      className={
        heightClass ||
        (variant === 'pods'
          ? 'block w-full h-[250px] sm:h-[240px] rounded-xl'
          : 'block w-full h-[280px] sm:h-[225px] rounded-xl')
      }
    />
  );
};
