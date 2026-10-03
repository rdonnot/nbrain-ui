# Adopt n’brain without rebuilding the application

The supplied ShowControl bundle is a reference subset, not a runnable full app. These patches are based on the included files. They have isolated TypeScript validation; they have not been integrated with the full app or aiohttp backend.

## Recommendation

Keep the current canvas, widget engines, state/store contracts, and ChromeProvider architecture. Consolidate visual primitives and improve interaction contracts incrementally. A full rewrite would discard useful production behavior and increase regression risk.

| Current foundation | Decision | Reason / next action |
|---|---|---|
| GlassPanel + ChromePanel + PanelStage + PanelRail | Preserve and polish | Saved placement, snapping, clean/live mode, close/reopen and focus order are valuable. Included patches add shared material, active glow, keyboard move/resize, labels. |
| widgetGlass overlap detection | Preserve | Glass only when overlapping is a sensible legibility and rendering policy. Use the same material tokens when the host paints an overlap. |
| Canvas / GridCanvas / WidgetCard | Preserve | Layout engines and per-widget state should remain stable. Replace only duplicated chrome paint recipes. |
| Widget typography and canvas-scale ladder | Preserve | Your 12px body and per-widget scale resolve zoom behavior. Do not impose the review board’s global font sizes on the canvas. |
| Neutral bases + independent accent ramps | Extend | Add Sapphire in both TS and CSS; keep Carbon/Graphite/Slate/Paper and saved user choices. Defaults change only for new/unset settings. |
| Base UI / shadcn primitives | Standardize | Existing React, Base UI, Motion, Tailwind and cva stack already fits this library. Fill missing semantic aliases before swapping every control. |
| Modal with stable tab frame | Preserve API, upgrade internals | Fixed dimensions avoid tab jumps. Base UI adds focus containment, scroll lock and nested-dialog dismissal. Existing exports remain. |
| DrawingCanvas controls and property rows | Promote gradually | Review numeric scrub, units, labels and reset as canonical parameter APIs before replacing feature call sites. |
| NLEDialogShell and copied panel recipes | Consolidate material first | Retain feature behavior; reuse shared shell material. Migrate interaction semantics separately. |
| Domain engines: Lexical, Three, maps, audio, streams | Preserve | They are not generic UI primitives and are not replaced by the review board. |
| Attention/confirmation service | Preserve dispatch model | `await confirm()` is a separate contract from a tabbed modal. Improve its accessible shell without merging the services. |
| components.json | Fix | Existing config names Hugeicons while the bundle uses Lucide, and points at a different CSS entry. Patch aligns it with supplied source. |

## Included files

`patched-frontend/` contains only changed/new files, with the same paths as your bundle. `nbrain-adoption.patch` is the equivalent unified diff. It does not contain a copy of the complete application.

1. Review the patch against the current checkout. Apply from the directory containing `frontend/` with `git apply --check nbrain-adoption.patch`, then `git apply nbrain-adoption.patch`. If paths or source changed, copy reviewed changes individually.
2. Keep your existing `package.json`. The adapters use dependencies already in the supplied package. Do not replace your dependency tree with the atelier demo’s package.
3. Keep importing `src/styles/index.css`. The patch adds the material adapter immediately after the existing tokens. Do not also import the atelier’s global `styles.css`: its resets and `--muted` definition would conflict with your application.
4. Theme defaults are Carbon + Sapphire. Existing explicit preferences remain. Add the new hue to any UI whitelist outside this subset. Keep the existing CSS↔TS ramp synchronization test and extend its expected IDs.
5. Replace hardcoded input `#fff` and floating dark fills in feature panels in small batches. The patched Modal input style is one example. Apply `.nbrain-energy-primary` explicitly to primary pipeline actions, and `.nbrain-core-progress` to an inner progress fill. Avoid assigning the agent glow to warning/danger states.
6. Give each Modal a meaningful localized `title`. The optional title preserves source compatibility; its generic fallback is not a finished accessible name. Existing custom close buttons must remain reachable. Mandatory gates must provide a successful way forward.
7. Use the review board to approve material/glow strength, bevel, elevation, fonts, and density before migrating all feature screens. The demo FloatingWindow is an alternate composition; it does not replace your persisted GlassPanel controller.

## Naming boundaries

- `components/ui/`: headless-backed general controls, form controls, accessible overlays.
- `components/ui/chrome/`: existing persistent panel/window controller and its material shell.
- `components/nbrain/`: agent states, approvals, project/shot compositions; domain-facing controlled props.
- `styles/`: one neutral/accent token source plus one material adapter.
- Feature widgets keep feature names. Do not rename every Modal/import or introduce a second independent panel state store.

The review board’s compound source files simplify delivery, but before broad production adoption split their public exports into stable one-component entry points. Keep the old paths as re-exports during migration. A local shadcn registry entry is provided for the new library, not a remotely published registry service.

## Production gates

- Run the real app’s typecheck, lint, vitest suite and bundle-budget script after applying each batch. The supplied subset cannot run these checks on behalf of the full application.
- Browser-test stacked windows/popovers and nested modals, keyboard focus and return focus, saved settings/positions, clean/live mode, font scaling and 200% zoom. Verify Paper plus Carbon, coarse pointers, tablet and mobile.
- Profile dragging and blur with real 3D/stream content. Preserve the existing transform/rAF drag path. No infinite glow animation is added to idle controls; live telemetry must remain on its data plane without an LLM.
- Keep narrow-screen canvas navigation behavior owned by the app. The demo stacks windows on mobile, while your canvas may intentionally pan/zoom. Pick that behavior deliberately per workspace.
- Fix missing `animate-in`/`animate-out` utilities with a consistent CSS/Motion implementation or an explicitly installed animation plugin. Do not assume classes alone animate.
- Audit parameter units, localization, disabled/loading/error states, permission gates and test coverage per feature. The current deliverable is a validated foundation and adoption patch, not proof that every widget is production ready.

## Light and muted semantics

The host’s `--muted` is a text color. Most shadcn presets expect a muted surface, so importing a generic preset breaks old `text-muted` consumers. The adapter preserves that name and maps `--muted-foreground` to it; surface variants should use `--raised`/`--raised-2`. Two existing Button hover class combinations receive a scoped correction. Audit remaining `bg-muted` use sites rather than redefine the variable globally.

The core glow follows the selected accent for consistency; choose Sapphire for the approved blue identity. Paper uses a lower glow amplitude and theme-derived glass so it does not inherit a black panel. Colored text uses the existing darker Paper ramp aliases. Optical contrast and material rendering still require real browser review.
