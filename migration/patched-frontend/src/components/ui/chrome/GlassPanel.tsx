/**
 * src/components/ui/chrome/GlassPanel.tsx
 *
 * The one floating panel, behaviour-identical to the 3D viewport's:
 *   • Drag by the header via a transform inside rAF — React state is written
 *     ONCE on release, so dragging a panel full of controls is zero body
 *     re-renders.
 *   • Edge snapping: within 14px of a container edge it magnetizes to an 8px
 *     inset, so hand-placed panels line up like docked ones.
 *   • Clamped to the container, re-clamped when the container shrinks.
 *   • Collapse to header; close reports upward so the rail can reopen it.
 *   • Placement (x/y/width/collapsed) persists per panel id under
 *     `<prefix>.panel.<id>` (prefix from PanelStage).
 *   • Click raises above siblings.
 *
 * Open/close is NOT owned here — the widget mounts/unmounts the panel.
 * Panel bodies render bare content; the frame is this.
 */

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useChrome } from "./PanelStage";

export interface PanelPlacement { x: number; y: number; collapsed: boolean; w?: number }

interface Props {
  /** Stable id — the persistence key and the rail identity. */
  id: string;
  title: string;
  icon?: React.ReactNode;
  accent?: string;
  /** A huge x or y means "that edge": the clamp pulls it into view. */
  defaultPos?: { x: number; y: number };
  width?: number;
  minWidth?: number;
  resizable?: boolean;
  onClose?: () => void;
  headerExtra?: React.ReactNode;
  /** Replace the default body wrapper classes — for content that owns its own
   *  scrolling. Keep data-hotkeys-ignore. */
  bodyClassName?: string;
  children: React.ReactNode;
}

const SNAP = 14;
const INSET = 8;

function loadPlacement(key: string): PanelPlacement | null {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : null; }
  catch { return null; }
}

export function GlassPanel({
  id, title, icon, accent, defaultPos, width = 264, minWidth = 200,
  resizable = false, onClose, headerExtra, bodyClassName, children,
}: Props) {
  const { containerRef, raisePanel, panelZ, activePanelId, accent: stageAccent, storagePrefix } = useChrome();
  const acc = accent ?? stageAccent;
  const storeKey = `${storagePrefix}.panel.${id}`;

  const [placement, setPlacement] = useState<PanelPlacement>(() => {
    const saved = loadPlacement(storeKey);
    if (!saved) return { x: defaultPos?.x ?? 12, y: defaultPos?.y ?? 12, collapsed: false, w: width };
    // A panel nobody can resize has the width its code says. The saved one
    // is from an earlier build of the same panel (the fSpy panel went from
    // 236 to 420 px) and would pin it there for anyone who ever dragged it.
    return resizable ? saved : { ...saved, w: width };
  });
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ kind: "move" | "size"; sx: number; sy: number; ox: number; oy: number; ow: number } | null>(null);
  const raf = useRef(0);
  const live = useRef({ x: placement.x, y: placement.y, w: placement.w ?? width });

  const persist = useCallback((p: PanelPlacement) => {
    setPlacement(p);
    try { localStorage.setItem(storeKey, JSON.stringify(p)); } catch { /* private mode */ }
  }, [storeKey]);

  const clamp = useCallback((x: number, y: number, w: number) => {
    const c = containerRef.current;
    if (!c) return { x, y };
    const cw = c.clientWidth, ch = c.clientHeight;
    const h = ref.current?.offsetHeight ?? 40;
    if (x < SNAP + INSET) x = INSET;
    if (y < SNAP + INSET) y = INSET;
    if (cw - (x + w) < SNAP + INSET) x = cw - w - INSET;
    if (ch - (y + h) < SNAP + INSET) y = ch - h - INSET;
    return {
      x: Math.max(0, Math.min(x, Math.max(0, cw - w))),
      y: Math.max(0, Math.min(y, Math.max(0, ch - Math.min(h, ch)))),
    };
  }, [containerRef]);

  /* A panel that has just appeared is the one the user just asked for, so it
     opens ON TOP. Without this it mounts at the base z and can land UNDER a
     panel that was interacted with earlier — and since the older panel then
     eats the clicks, there is no way to raise the new one by clicking it. */
  useLayoutEffect(() => { raisePanel(id); }, [id, raisePanel]);

  /* Re-clamp when the container resizes. */
  useLayoutEffect(() => {
    const c = containerRef.current;
    if (!c || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      setPlacement(p => {
        const { x, y } = clamp(p.x, p.y, p.w ?? width);
        return x === p.x && y === p.y ? p : { ...p, x, y };
      });
    });
    ro.observe(c);
    return () => ro.disconnect();
  }, [containerRef, clamp, width]);

  const apply = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `translate(${live.current.x}px, ${live.current.y}px)`;
    el.style.width = `${live.current.w}px`;
  };

  const onHeaderDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    raisePanel(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { kind: "move", sx: e.clientX, sy: e.clientY,
      ox: placement.x, oy: placement.y, ow: placement.w ?? width };
  }, [id, placement, raisePanel, width]);

  const onGripDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation();
    raisePanel(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { kind: "size", sx: e.clientX, sy: e.clientY,
      ox: placement.x, oy: placement.y, ow: placement.w ?? width };
  }, [id, placement, raisePanel, width]);

  const onMove = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if (d.kind === "move") {
      const { x, y } = clamp(d.ox + dx, d.oy + dy, live.current.w);
      live.current.x = x; live.current.y = y;
    } else {
      const cw = containerRef.current?.clientWidth ?? Infinity;
      live.current.w = Math.max(minWidth, Math.min(d.ow + dx, cw - d.ox - INSET));
    }
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(apply);
  }, [clamp, containerRef, minWidth]);

  const onUp = useCallback(() => {
    if (!drag.current) return;
    drag.current = null;
    cancelAnimationFrame(raf.current);
    persist({ ...placement, x: live.current.x, y: live.current.y, w: live.current.w });
  }, [persist, placement]);

  useLayoutEffect(() => {
    live.current = { x: placement.x, y: placement.y, w: placement.w ?? width };
    apply();
  }, [placement, width]);

  const active = activePanelId === id;

  return (
    <div
      ref={ref}
      data-nodrag="1"
      data-active={active}
      role="region"
      aria-label={title}
      onFocusCapture={() => raisePanel(id)}
      onPointerDown={() => raisePanel(id)}
      onMouseDown={e => e.stopPropagation()}
      className="nbrain-glass-panel absolute left-0 top-0 select-none text-foreground"
      style={{ zIndex: panelZ(id), contain: "layout paint", willChange: "transform" }}
    >
      <div
        tabIndex={0}
        aria-label={`Move ${title} panel with arrow keys`}
        onKeyDown={e => {
          if (e.target !== e.currentTarget || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
          e.preventDefault(); const step = e.shiftKey ? 24 : 8;
          const point = clamp(placement.x + (e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0), placement.y + (e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0), placement.w ?? width);
          raisePanel(id); persist({ ...placement, ...point });
        }}
        onPointerDown={onHeaderDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="nbrain-panel-header flex h-8 cursor-grab items-center gap-2 rounded-t-xl px-2.5 active:cursor-grabbing"
      >
        {icon && <span className="text-[var(--wgt-title)] leading-none" style={{ color: acc }}>{icon}</span>}
        <span className="flex-1 truncate text-[var(--wgt-body)] font-medium tracking-wide">{title}</span>
        {headerExtra}
        <button
          onClick={() => persist({ ...placement, collapsed: !placement.collapsed })}
          type="button"
          aria-expanded={!placement.collapsed}
          aria-label={placement.collapsed ? "Expand panel" : "Collapse to header"}
          title={placement.collapsed ? "Expand panel" : "Collapse to header"}
          className="grid h-5 w-5 place-items-center rounded text-[var(--wgt-body)] text-fg-3 hover:bg-raised-2 hover:text-fg"
        >
          <span className={`transition-transform ${placement.collapsed ? "-rotate-90" : ""}`}>▾</span>
        </button>
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            aria-label="Close panel"
            title="Close panel"
            className="grid h-5 w-5 place-items-center rounded text-[var(--wgt-body)] text-fg-3 hover:bg-raised-2 hover:text-fg"
          >×</button>
        )}
      </div>

      {!placement.collapsed && (
        <div
          className={bodyClassName ?? "max-h-[70vh] overflow-y-auto border-t border-line p-2"}
          data-hotkeys-ignore>
          {children}
        </div>
      )}

      {resizable && !placement.collapsed && (
        <button
          type="button"
          aria-label={`Resize ${title} panel`}
          onKeyDown={e => {
            if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
            e.preventDefault(); const available = (containerRef.current?.clientWidth ?? 1000) - placement.x - INSET;
            persist({ ...placement, w: Math.min(available, Math.max(Math.min(minWidth, available), (placement.w ?? width) + (e.key === "ArrowRight" ? 16 : -16))) });
          }}
          onPointerDown={onGripDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="nbrain-panel-resize absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 cursor-nwse-resize rounded-br-xl border-b-2 border-r-2 border-line-2"
        />
      )}
    </div>
  );
}
