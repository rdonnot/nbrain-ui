/**
 * src/components/ui/chrome/PanelStage.tsx
 *
 * The one chrome context for a widget that shows a picture with tools over
 * it — the 3D viewport, the drawing canvas, the stage plan. Everything drawn
 * OVER the image reads this: which panels exist and which are open, panel
 * z-order (click-to-raise), the accent colour, clean mode, and the element
 * the panels clamp inside.
 *
 * Panels may self-describe through <ChromePanel> (id, title, icon), so the
 * rail can render a reopen chip for anything closed without a hand-kept
 * list — adding a panel is one child, not edits in three files. A widget
 * that prefers to own its open-state (the drawing canvas, whose panel.*
 * commands already toggle booleans) can drive the rail with props instead;
 * both read the same provider.
 *
 * Clean mode is the "maximize visualization" switch: it hides every panel
 * and the toolbar in one place, instead of each overlay checking its own
 * flag. The picture stays; only chrome goes.
 *
 * `live` is the host saying it is SHOWING the picture, not editing it (the
 * app's perform mode). Chrome starts hidden and the rail leaves no restore
 * chip, because an icon on the picture is what Live exists to remove. The
 * clean toggle still brings the chrome back — scouting and sculpting need the
 * canvas, which only takes input in Live — and leaving Live forgets that, so
 * the next time the host goes live it starts clean again.
 *
 * `storagePrefix` keeps one widget's persisted placements and open set from
 * colliding with another's: `vp3.*` for the viewport, `draw.*` for the
 * canvas, `plan.*` for the stage plan.
 */

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export interface PanelInfo { id: string; title: string; icon?: React.ReactNode }

export interface ChromeState {
  containerRef: React.RefObject<HTMLElement | null>;
  accent: string;
  storagePrefix: string;
  /** All panels registered this render, open or not. */
  panels: PanelInfo[];
  openIds: Set<string>;
  openPanel: (id: string) => void;
  closePanel: (id: string) => void;
  togglePanel: (id: string) => void;
  registerPanel: (info: PanelInfo, defaultOpen: boolean) => () => void;
  /** Raise on interaction; panelZ resolves the current z for an id. */
  raisePanel: (id: string) => void;
  panelZ: (id: string) => number;
  /** Most recently raised window, including panels with caller-owned lifecycle. */
  activePanelId?: string;
  cleanMode: boolean;
  setCleanMode: (v: boolean | ((v: boolean) => boolean)) => void;
  /** The host is live — see the header. */
  live: boolean;
}

const Ctx = createContext<ChromeState | null>(null);
const BASE_Z = 20;

/**
 * Above every floating panel, below a modal overlay.
 *
 * Panels stack from BASE_Z upward — one z per panel in raise order — so a
 * popover pinned at the toolbar's own z-19 ended up UNDERNEATH any panel that
 * happened to overlap it. Anything transient and menu-like belongs here: it
 * is dismissed by the next click, so it cannot get in anyone's way by staying.
 * 40 is the shortcut overlay, which is modal and must stay on top of this.
 */
export const POPOVER_Z = 36;

export function useChrome(): ChromeState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useChrome outside <ChromeProvider>");
  return v;
}

/** The same, for chrome that may render outside a provider (a status bar in a plain widget). */
export function useChromeOptional(): ChromeState | null {
  return useContext(Ctx);
}

export function loadOpenPanels(storagePrefix: string, fallback: string[] = []): Set<string> {
  try {
    const raw = localStorage.getItem(`${storagePrefix}.panels.open`);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* private mode */ }
  return new Set(fallback);
}

export function saveOpenPanels(storagePrefix: string, open: Set<string>): void {
  try { localStorage.setItem(`${storagePrefix}.panels.open`, JSON.stringify([...open])); } catch { /* private mode */ }
}

export function ChromeProvider({ accent = "var(--acc)", storagePrefix = "chrome", containerRef, live = false, children }: {
  accent?: string;
  /** Namespace for persisted placements and the open set. */
  storagePrefix?: string;
  containerRef: React.RefObject<HTMLElement | null>;
  /** Showing, not editing: chrome starts hidden. See the header. */
  live?: boolean;
  children: React.ReactNode;
}) {
  const [panels, setPanels] = useState<PanelInfo[]>([]);
  const [openIds, setOpenIds] = useState<Set<string>>(() => loadOpenPanels(storagePrefix));
  const seeded = useRef(new Set<string>());   // ids whose defaultOpen was applied

  // Two clean states: the editing one, kept across a trip to Live, and the
  // Live one, which starts hidden every time. Reset DURING RENDER rather than
  // in an effect, so going live never paints a frame of chrome first.
  const [editClean, setEditClean] = useState(false);
  const [liveShown, setLiveShown] = useState(false);
  const [wasLive, setWasLive] = useState(live);
  if (live !== wasLive) { setWasLive(live); setLiveShown(false); }
  const cleanMode = live ? !liveShown : editClean;
  const setCleanMode = useCallback((v: boolean | ((v: boolean) => boolean)) => {
    if (live) setLiveShown(shown => !(typeof v === "function" ? v(!shown) : v));
    else setEditClean(v);
  }, [live]);
  const [order, setOrder] = useState<string[]>([]);  // back → front

  const openPanel = useCallback((id: string) => setOpenIds(prev => {
    if (prev.has(id)) return prev;
    const next = new Set(prev); next.add(id); saveOpenPanels(storagePrefix, next); return next;
  }), [storagePrefix]);
  const closePanel = useCallback((id: string) => setOpenIds(prev => {
    if (!prev.has(id)) return prev;
    const next = new Set(prev); next.delete(id); saveOpenPanels(storagePrefix, next); return next;
  }), [storagePrefix]);
  const togglePanel = useCallback((id: string) => setOpenIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    saveOpenPanels(storagePrefix, next); return next;
  }), [storagePrefix]);

  const registerPanel = useCallback((info: PanelInfo, defaultOpen: boolean) => {
    setPanels(prev => prev.some(p => p.id === info.id) ? prev : [...prev, info]);
    // Apply defaultOpen once per id per session, and only when the user has
    // no saved preference — a panel they closed stays closed across reloads.
    if (!seeded.current.has(info.id)) {
      seeded.current.add(info.id);
      let hasSaved = false;
      try { hasSaved = !!localStorage.getItem(`${storagePrefix}.panels.open`); } catch { /* ignore */ }
      if (defaultOpen && !hasSaved) openPanel(info.id);
    }
    return () => setPanels(prev => prev.filter(p => p.id !== info.id));
  }, [openPanel, storagePrefix]);

  const raisePanel = useCallback((id: string) => setOrder(prev =>
    prev[prev.length - 1] === id ? prev : [...prev.filter(x => x !== id), id]), []);
  const panelZ = useCallback((id: string) => {
    const i = order.indexOf(id);
    return BASE_Z + (i < 0 ? 0 : i + 1);
  }, [order]);

  const value = useMemo<ChromeState>(() => ({
    containerRef, accent, storagePrefix, panels, openIds,
    openPanel, closePanel, togglePanel, registerPanel,
    raisePanel, panelZ, activePanelId: order[order.length - 1], cleanMode, setCleanMode, live,
  }), [containerRef, accent, storagePrefix, panels, openIds, openPanel, closePanel, togglePanel,
       registerPanel, raisePanel, panelZ, order, cleanMode, setCleanMode, live]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Older names, kept so a widget written against the first cut still reads. */
export const PanelStage = ChromeProvider;
export const usePanelStage = useChrome;
