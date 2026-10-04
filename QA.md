# Verification

- TypeScript strict compilation: passed.
- Production Vite build: passed.
- Standalone HTML bundling: passed; React, styles, font data, and approved raster reference embedded.
- Twenty-two DOM interaction checks: passed, no runtime errors. Details in `dom-checks.json`.
- Checked behaviors: all sections mount, strong agent core, dark/light theme, persisted approvals, modal opening/closing, tab switching, pressed toggles, approval gates, agent state changes, searchable combobox, table filtering, form errors, settings sheet, and JSON export.
- CSS includes desktop, tablet, and mobile breakpoints plus compact density, local horizontal table scrolling, and system/custom reduced-motion handling.

## Remaining visual checks

The available browser runner could not launch here. Actual desktop/mobile screenshot verification, backdrop-filter rendering, optical font/logo matching, and 200% zoom checks remain to be done in a browser. The DOM checks do not prove visual quality or contrast.

## Reproduce interaction checks

The verification script is included. It uses optional test tools rather than application dependencies:

```bash
npm install --no-save jsdom esbuild
node scripts/verify-dom.mjs
```

The review page is a complete working prototype with simulated production data. It does not call your real backend. The custom image-generated logo is preserved as the approved raster reference; final vector tracing remains a separate unresolved branding task.

## v0.2 window and host adapter checks

- Floating windows: minimize, close, dock restore, and workspace restore passed.
- Ten isolated host-adapter checks passed: legacy panel props, active/focus order, keyboard positioning and resizing, saved placement keys, collapse, named modal, Escape dismissal, mandatory gate dismissal refusal and normal completion. See `adapter-checks.json`.
- Patched host components pass isolated strict TypeScript validation with `tsc -p migration/tsconfig.json`.
- These do not prove real pointer dragging, blur performance, viewport appearance, nested modal focus, or compatibility with imports outside the supplied subset. Run full application checks after integration.

## 0.3 package and radial inspector

- Separate ESM/library and static/demo builds, generated declarations and namespaced provider-scoped CSS.
- All 74 exact widget IDs mount, with deep links, filtering, input updates, per-widget approvals and usage pages checked.
- Circular inspector checks cover category/orbit switching, numeric keyboard bounds, hue ring, swatch selection, preset intent, floating open/close, command nesting, disabled leaves and leaf dispatch.
- The actual tarball is installed in an independent consumer; ESM/SSR imports and root/widgets TypeScript contracts are compiled. See package-checks.json.
- React 18 is the tested and declared peer version. Heavy engine views in the atlas are explicitly design previews.
- No actual browser rendering, pointer geometry, contrast, mobile screenshots, WebGL performance, screen-reader behavior or full-app integration has been verified here. Those remain release gates.

## 0.3.1 progressive menu

- Radial checks include inner-ring-first opening, hover selection, touch tap, right-click launch, reopen reset, long-press launch, movement cancellation and multi-touch cancellation.
- Desktop section hover has a 140ms intent delay. Touch does not select via pointer hover.
- Real touchscreen/browser gesture and visual animation checks remain necessary before release.

## 0.3.2 direct controls

39 radial DOM checks pass, including no-jump direct dragging, drag cancellation, satellite keyboard bounds, icon and nested ring navigation, center Back, and prompt dispatch/clear. Build and independent tarball-consumer checks pass. These synthetic event checks do not replace real mouse/touch or visual review.

## 0.3.3 frosted and compact inspector

45 radial DOM checks pass. New checks cover compact/full sizing, shared floating sizing, preserved values after switching, press-time stability in the center, center dragging without navigation, and retained nested command Back. Actual glass rendering and pointer/touch feel still require browser review.

## 0.7 native drop-ins

`scripts/verify-v07.mjs` (jsdom) renders every new component and checks prop forwarding (id, name, data-*, aria-*, ref), native `onChange`, controlled/uncontrolled values, the `--nb-range-pct` fill, indeterminate, file names, Input/Textarea sizes and the compact density attributes. Not verified here: real browser rendering of the webkit/moz range, colour and date pseudo-elements, the dark-theme date icon and mobile pickers.
