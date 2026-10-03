# Circular inspector

`RadialInspector` is the new visual anchor for n’brain: a quiet frosted disc, category wedges, an orbit of contextual controls, and a central precision dial. The blue light comes from active interaction. Oxanium varies from light dial values to bold selected categories.

The layout follows the four supplied reference images. It is implemented with SVG, HTML buttons and controlled React values, rather than raster artwork. Material/engine rendering stays in the application.

## Components

| Export | Purpose |
|---|---|
| RadialInspector | Inline circular inspector with category, parameter, choice and action contracts. |
| RadialInspectorContextMenu | Right-click, touch long-press and keyboard trigger wrapper around the floating inspector. |
| RadialInspectorOverlay | Controlled floating version; open/onOpenChange, optional viewport anchorPoint. |
| RotaryDial | Keyboard and pointer-adjustable central dial, limits/steps/units, optional hue ring. |
| RadialMenu | Compatible command-menu wrapper for the supplied original right-click API. Submenus, disabled leaves and controlled anchoring remain. |

## Controlled inspector example

```tsx
import { useState } from 'react';
import { NBrainProvider, RadialInspector, type RadialCategory } from '@nbrain/ui';
import '@nbrain/ui/styles.css';
import '@nbrain/ui/fonts.css';

const categories: RadialCategory[] = [
  { id: 'surface', label: 'Surface', controls: [
    { kind: 'parameter', id: 'coat', label: 'Coat', unit: '%', defaultValue: 25 },
    { kind: 'parameter', id: 'gloss', label: 'Gloss', defaultValue: 60 },
  ] },
  { id: 'colour', label: 'Colour', controls: [
    { kind: 'parameter', id: 'hue', label: 'Hue', min: 0, max: 360,
      unit: '°', hue: true, defaultValue: 224 },
  ] },
];

function MaterialInspector() {
  const [categoryId, setCategory] = useState('surface');
  const [activeParameterId, setParameter] = useState('coat');
  const [values, setValues] = useState<Record<string, number | string>>({
    coat: 25, gloss: 60, hue: 224,
  });
  return <NBrainProvider>
    <RadialInspector categories={categories} categoryId={categoryId}
      onCategoryChange={setCategory} values={values}
      onValueChange={(id, value) => setValues(v => ({ ...v, [id]: value }))}
      activeParameterId={activeParameterId}
      onActiveParameterChange={setParameter}
      breadcrumb={['Material', 'Brushed silver', 'Solid']}
    />
  </NBrainProvider>;
}
```

Use 8–10 category wedges and a manageable number of controls in each orbit. The orbit can contain parameters, material swatches or actions. By default only the inner category ring appears. Hovering a section on desktop selects it after a short 140ms intent delay; touch users tap. Sections with multiple controls expand the outer orbit. A single parameter uses the central dial directly. A single action runs on explicit activation. Hovering a satellite parameter assigns it to the central dial; hovering a swatch selects its value. Action buttons execute when activated. Use `progressive={false}` for an always-expanded inline inspector. `hoverDelay` configures desktop intent timing. Actions dispatch explicitly when clicked, never on hover.

## Interaction

- Open the contextual inspector with right-click, touch hold (500ms default), or Shift+F10 while the host is focused. Touch movement over 10px, another touch, scroll, cancellation or unmount cancels the pending hold. Release after a successful hold does not activate the underlying object. `longPressDelay`, `movementTolerance`, and `longPress` are host options.
- Sections accept a Lucide `icon` and recursive `children`. Add opens a child ring. Click the center of a nested command menu to return to its parent. A parameter dial keeps its center available for value dragging; use Back to sections or Escape to navigate.
- Escape or Back to sections collapses an expanded inspector; Escape again dismisses the floating menu. Reopening starts at the inner ring.
- Drag satellite dials directly up/right to increase or down/left to decrease. Pressing preserves the current value; Shift makes pointer adjustment ten times finer. Drag the central value up/right or down/left for relative adjustment without a press-time jump. Drag the outside ring around its 270° arc. Arrow keys adjust by one step; Shift uses ten steps; Home/End reach bounds; PageUp/PageDown also use ten steps.
- `onInteractionStart` and `onInteractionEnd` provide pointer-drag boundaries for the host’s undo/commit grouping. The host should also group keyboard edits according to its existing undo policy.
- The demo supplies an exact numeric field alongside the dial. In production, compose that field next to the inspector as appropriate for the workspace.
- On narrow screens an ordinary category selector and 44px control rows provide a readable alternative to the small orbit. The circular overview remains visible.
- System reduced motion is respected. The provider also supports disabling Motion transforms and CSS animations.
- Overlay placement is constrained to the viewport and may scroll vertically on narrow screens. It is nonmodal; outside interaction and Escape dismiss it. Verify focus return with the actual app trigger.

## Existing radial callers

The package `RadialMenu` preserves `menuItems`, numeric item IDs, Lucide icons, nested children, disabled flags, `onSelect`, controlled `open`/`onOpenChange`, viewport `anchorPoint`, and size/band/gap parameters. The uncontrolled wrapper opens with right-click or Shift+F10. Touch long-press is now supported by default. A host with a precision drawing surface can set `longPress={false}` and use its explicit tools button; the default does not capture touch-down or disable scrolling.

After installing the package and provider, the main app may keep its import path by replacing the old wrapper with:

```tsx
export { RadialMenu } from '@nbrain/ui';
export type { RadialMenuItem } from '@nbrain/ui';
```

Do this as a reviewed application change and run the real NLE/drawing/stage callers. The supplied subset does not contain all those host modules. Use `RadialInspector` for persistent contextual editing; keep `RadialMenu` for discrete commands.

## Next branding step

The current logo is unchanged. Once the inspector’s proportions, typography and material are approved, the logo can borrow its central core, thin concentric structure, controlled blue energy and connected outer nodes.

## Context trigger

Wrap the workspace target with `RadialInspectorContextMenu`, passing the same categories/value callbacks as the inline inspector. Its children are the selected object or preview. The wrapper ignores native text-entry fields and `data-radial-ignore` targets. Desktop selection happens on hover, while action execution remains explicit. The host still owns undo/commit semantics and backend commands.

## Agent prompt

The bottom prompt bar shares the top breadcrumb’s smoked glass and rounded proportions. `onAgentPrompt(prompt, context)` receives the category ID/path, selected parameter, value snapshot and breadcrumb. Connect it to the host’s agent pipeline. The demo records intent only. Async callbacks lock submission while pending, clear the draft on success and preserve it on failure. The host can also set `agentBusy` and `agentPromptPlaceholder`.

## Display modes

`displayMode="compact"` is the default (460px maximum). `displayMode="full"` uses 700px; `size` can override either maximum. The lab exposes a live Compact / Full size switch, shared by the inline and contextual inspectors. Switching preserves values and the selected section. Both modes retain pointer/touch and keyboard controls. The central lens and ring backing use translucent frosted glass; orbit controls float outside the reduced backing disc.
