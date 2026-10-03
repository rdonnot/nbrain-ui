/**
 * src/lib/theme.ts — the theme model: a neutral BASE and a tonal ACCENT.
 *
 * WHAT WAS WRONG. A theme was six hand-picked hex values per surface, and the
 * default one ("Dark Navy") tinted every surface a saturated blue — the app
 * shell, the canvas, every widget card. Colour that is everywhere is not an
 * accent, it is a cast, and it fought every widget's own colour. Meanwhile
 * each widget TYPE shipped with its own accent (buttons blue, toggles green,
 * viewports teal…), so a fresh canvas was a rainbow and "the theme" changed
 * almost nothing you could see.
 *
 * THE MODEL NOW.
 *
 *   base    the neutral surfaces: app shell, panels, canvas, cards, hairlines,
 *           text. Grey or black, never tinted. Four of them — three dark, one
 *           light — differing in depth, not in hue.
 *   accent  ONE hue, as a full tonal ramp (50 → 950). Everything that is
 *           coloured on purpose — selection, focus rings, primary buttons,
 *           the active tab, a widget's chrome — is a step of that ramp, so
 *           the whole app is variants of one colour rather than one or two
 *           flat picks. Eight hues, including a monochrome one for a screen
 *           that wants no colour at all.
 *
 * Widgets default to the accent id "theme", which resolves to the app's
 * accent at render time (see getAccent in lib/constants). A widget can still
 * be given its own hue — that is a deliberate act now, not the default.
 *
 * This module is a LEAF: no React, no store. lib/constants.ts and App.tsx
 * import it; the CSS side of the same tables lives in styles/tokens.css and
 * the two are kept in step by the test.
 */

/** A tonal ramp, Tailwind-style steps. */
export type Ramp = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>;

export interface ThemeBase {
  id:      string;
  name:    string;
  /** Light bases invert the accent steps (a 500 that reads on black is too
   *  pale on white). */
  light:   boolean;
  bg:      string;
  surface: string;
  canvas:  string;
  widget:  string;
  border:  string;
  text:    string;
  muted:   string;
  dot:     string;
}

export interface ThemeAccent {
  id:   string;
  name: string;
  ramp: Ramp;
}

// ── Bases ────────────────────────────────────────────────────────────────────
// Neutral by construction: every value has near-zero chroma. Depth comes from
// lightness steps of ~3%, which is enough to tell a card from the canvas
// without drawing a line around it.
export const THEME_BASES: ThemeBase[] = [
  { id: "graphite", name: "Graphite", light: false,
    bg: "#141517", surface: "#1a1b1e", canvas: "#101113", widget: "#1c1d21",
    border: "#2a2b30", text: "#e6e7ea", muted: "#8b8e95", dot: "#26272b" },
  { id: "carbon",   name: "Carbon",   light: false,
    bg: "#000000", surface: "#0b0b0c", canvas: "#050506", widget: "#111113",
    border: "#202024", text: "#ececee", muted: "#86888e", dot: "#1a1a1e" },
  { id: "slate",    name: "Slate",    light: false,
    bg: "#0f1115", surface: "#151821", canvas: "#0c0e12", widget: "#181b24",
    border: "#262a35", text: "#e3e6ec", muted: "#8a90a0", dot: "#232733" },
  { id: "paper",    name: "Paper",    light: true,
    bg: "#f3f4f6", surface: "#ffffff", canvas: "#f7f7f8", widget: "#ffffff",
    border: "#e3e4e8", text: "#16181d", muted: "#5b606b", dot: "#d5d7dc" },
];

// ── Accents ──────────────────────────────────────────────────────────────────
export const THEME_ACCENTS: ThemeAccent[] = [
  { id: "sapphire", name: "n’brain Sapphire", ramp: {"50": "#eef2ff", "100": "#dce5ff", "200": "#bdcdff", "300": "#99b3ff", "400": "#7695fb", "500": "#4167e9", "600": "#284acf", "700": "#2438a2", "800": "#202f79", "900": "#17244f", "950": "#0b1430"} },
  { id: "indigo",  name: "Indigo",  ramp: { 50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3", 900: "#312e81", 950: "#1e1b4b" } },
  { id: "sky",     name: "Sky",     ramp: { 50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc", 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1", 800: "#075985", 900: "#0c4a6e", 950: "#082f49" } },
  { id: "teal",    name: "Teal",    ramp: { 50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a", 950: "#042f2e" } },
  { id: "emerald", name: "Emerald", ramp: { 50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22" } },
  { id: "amber",   name: "Amber",   ramp: { 50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03" } },
  { id: "rose",    name: "Rose",    ramp: { 50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 800: "#9f1239", 900: "#881337", 950: "#4c0519" } },
  { id: "violet",  name: "Violet",  ramp: { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065" } },
  { id: "mono",    name: "Mono",    ramp: { 50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7", 300: "#d4d4d8", 400: "#a1a1aa", 500: "#8b8b94", 600: "#71717a", 700: "#52525b", 800: "#3f3f46", 900: "#27272a", 950: "#18181b" } },
];

export const DEFAULT_BASE   = "carbon";
export const DEFAULT_ACCENT = "sapphire";

/**
 * The ids that existed before base and accent were separate. Each one was a
 * tinted base with an implied hue; they map to the neutral base and the hue
 * as an accent, so a saved settings file opens looking like itself, only
 * without the cast.
 */
export const LEGACY_THEMES: Record<string, { base: string; accent: string }> = {
  "dark-navy":     { base: "graphite", accent: "indigo" },
  "dark-charcoal": { base: "graphite", accent: "indigo" },
  "dark-green":    { base: "graphite", accent: "emerald" },
  "dark-purple":   { base: "graphite", accent: "violet" },
  "dark-warm":     { base: "graphite", accent: "amber" },
  "light":         { base: "paper",    accent: "indigo" },
};

export const getBase = (id: string | undefined): ThemeBase =>
  THEME_BASES.find(b => b.id === id)
  ?? THEME_BASES.find(b => b.id === LEGACY_THEMES[id ?? ""]?.base)
  ?? THEME_BASES.find(b => b.id === DEFAULT_BASE)!;

export const getThemeAccent = (id: string | undefined): ThemeAccent =>
  THEME_ACCENTS.find(a => a.id === id) ?? THEME_ACCENTS.find(a => a.id === DEFAULT_ACCENT)!;

/** What a settings record means today. `accentId` unset on a legacy theme id
 *  takes the hue that theme implied; unset otherwise is the default. */
export function resolveTheme(settings: { themeId?: string; accentId?: string }): {
  base: ThemeBase; accent: ThemeAccent;
} {
  const legacy = LEGACY_THEMES[settings.themeId ?? ""];
  const base = getBase(settings.themeId);
  const accent = getThemeAccent(settings.accentId || legacy?.accent || DEFAULT_ACCENT);
  return { base, accent };
}

/** The four values a widget's chrome paints with, from one ramp. Same
 *  shape as ACCENT_COLS in lib/constants so every consumer of getAccent()
 *  keeps working. On a light base the steps flip: a 500 that reads on black
 *  is too pale on white. */
export function accentTokens(accent: ThemeAccent, light: boolean) {
  const r = accent.ramp;
  return light
    ? { bg: r[50],  border: r[500], text: r[700], acc: r[600] }
    : { bg: r[950], border: r[600], text: r[200], acc: r[500] };
}
