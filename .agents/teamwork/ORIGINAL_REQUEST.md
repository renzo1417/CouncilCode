# Original User Request

## 2026-10-17T03:42:32Z

This is a single self-contained fix; keep it small and focused. Fix the 5 React 19 console errors ("Attempted to synchronously unmount a root while React was already rendering") occurring in the CouncilCode 3D scene (`AgentCharacter.tsx`, `Workstation.tsx`, `SandboxStation.tsx`) by replacing `@react-three/drei`'s `<Html>` (which creates and unmounts separate React DOM roots synchronously during render in React 19) with a React 19-safe approach, while preserving clear 3D visual identification and click interactivity.

Working directory: d:\Landing\councilcode
Integrity mode: development

## Requirements

### R1. Eliminate React 19 Synchronous Root Unmount Console Errors
Remove all uses of `@react-three/drei`'s `<Html>` in `src/components/3d/AgentCharacter.tsx`, `src/components/3d/Workstation.tsx`, and `src/components/3d/SandboxStation.tsx` (or replace them with a React 19-compatible mechanism that does not call `createRoot` / `root.unmount()` inside R3F's render lifecycle) so that zero "Attempted to synchronously unmount a root while React was already rendering" errors occur.

### R2. Preserve 3D Station & Worker Visual Clarity and Interactivity
Maintain clear 3D visual status indicators and click interactivity for all workers, stations, and vacant desks (`AgentCharacter.tsx`, `Workstation.tsx`, `SandboxStation.tsx`) alongside the `StudioRosterDock` UI navigator.

## Acceptance Criteria

### Zero Console & Build Errors
- [ ] Zero `@react-three/drei` `<Html>` synchronous root unmount errors in `AgentCharacter.tsx`, `Workstation.tsx`, and `SandboxStation.tsx`.
- [ ] `npm run lint` exits with code 0 and zero errors/warnings.
- [ ] `npx tsc --noEmit` exits with code 0 and zero type errors.
- [ ] `npm run build` succeeds cleanly.
