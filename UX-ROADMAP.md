# Experience improvements for n’brain

Priorities derive from the supplied registry, chrome, modal, theme and control sources. The supplied inventory’s whole-app counts are estimates; this project independently reads the 74 entries from constants.ts, not all 870 original source files.

| Priority | Improvement | Current deliverable | Remaining application work |
|---|---|---|---|
| P0 | State consistency | WidgetFrame previews ready/loading/empty/error/offline; retry and reconnect intent | Preserve actual last-known data, cancellation, partial results, backend errors and retries per feature. |
| P0 | Agent clarity | Running glow, progress, explicit human gate, approve/revise controls | Show owner, goal, stage, proposed action, cost/time estimate, cancellation and audit history. Use real permission checks. |
| P0 | Window predictability | Active rims, unified chrome, pin/dock intent; compatibility-preserving panel patch | Persist layouts by workspace, stable z bands, nested menu placement, keyboard move/resize, minimize/restore, reliable focus return. |
| P0 | Parameter editing | NumericScrub, units, modified state, reset, ParameterRow | Bind schema, validation, precision, undo grouping, mixed multi-selection and real default values. |
| P0 | Accessibility | Base UI overlays/controls, labels, keyboard alternatives, reduced motion, inert thumbnails | Real browser focus tests, contrast, 200% zoom, screen readers, nested dialogs, touch targets and localized accessible names. |
| P1 | Navigation and discoverability | Searchable widget catalog, deep links, consistent contracts | Global command search, recent/pinned widgets, palette categories, breadcrumbs, useful tooltips and shortcuts. |
| P1 | Responsive density | Gallery phone/tablet widths, compact controls, mobile window stacking demo | Define per-widget collapse policies. Preserve canvas pan/zoom; turn inspectors into sheets on touch layouts when appropriate. |
| P1 | Recovery and confidence | Local review approvals and demo retry states | Autosave indicators, dirty/conflict states, undo/redo, job resume, reconnect reconciliation and role attribution. |
| P1 | Large project performance | Package/demo separation, controlled data, no bundled heavy engines | Profile real blur and drag with GPU streams, virtualize large trees/tables, suspend hidden windows, cap animation and telemetry render rates. |
| P2 | Documentation and governance | Atlas, usage/contract pages, coverage manifest, package checks and CI | Feature adapter examples, screenshot tests, changelog discipline, version policy and staged app adoption. |

## What to preserve

Keep the existing canvas layout, widgetGlass overlap policy, canvas typography compensation, stable registry IDs, local/backend architecture and ChromeProvider persistence. The material upgrade should not change live data-plane timing or add an LLM in its hot path.

## What this project does not claim

74 preview pages are not 74 ported production engines. Complex widgets expose a styled slot for the existing app renderer. Generic list/table/document views are design compositions, not replacements for Lexical, React Flow, Three, Supersplat, maps, NLE or production review logic.
