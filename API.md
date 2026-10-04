# Public API

The generated declarations in `dist/` are authoritative. Every component is exported from `@nbrain/ui`; the widget-specific view exports are also available at `@nbrain/ui/widgets`.

| Entry | Contract |
|---|---|
| NBrainProvider | One application provider; theme dark/light, density comfortable/compact, glow 0..1, motion boolean. System reduced motion is respected. |
| NumericScrub | Controlled numeric value, min/max/step/unit/defaultValue; keyboard, horizontal drag and reset. Shift-drag gives finer increments. |
| ParameterRow | Label, hint, child control, modified marker and optional reset callback. |
| WidgetFrame | Title, registry ID, active/state/pinned/dock, controlled lifecycle callbacks; ready/loading/empty/error/offline presentation. |
| DockPicker | Controlled free/left/right/top/bottom/fill selection. Parent performs layout. |
| ConnectionBanner | Connected/reconnecting/offline status and optional reconnect callback. |
| WidgetView | widgetId, WidgetValue, onValueChange; optional items/messages/samples/actions/description; children are the real engine surface. |
| WidgetValue | Scalar, text, enabled, color, joystick point, transform XYZ, playing and optional selectedId. Controlled by the host. |
| WidgetItem | id/label; optional detail/status/progress/children/color. |
| WidgetMessage | id, human/agent role, name, text. |
| getWidgetDefinition | Original registry metadata plus presentation kind and implementation status. |
| widgetCatalog | 74 exact registry IDs with original dimensions/categories and implementation classification. |
| SliderWidget / FaderWidget / NumericWidget | Controlled scalar values. |
| ButtonWidget / ToggleWidget / TextWidget / ColorWidget | Controlled trigger, boolean, text or color input. |
| JoystickWidget / CurveWidget / TransformWidget | Controlled point, tension scalar or XYZ values. |
| ScopeWidget / MeterWidget | Supplied telemetry samples/level; no live transport. |
| AssetGridWidget / TreeWidget / QueueWidget | Supplied items, selection/action callbacks; Tree owns disclosure state. |
| ChatWidget | Supplied messages, send callback; owns only the draft composer text. |
| EngineViewport | Header/footer slots and renderer children; no Three, map, audio or NLE runtime dependency. |
| Density | `data-nbrain-density="compact"` on any ancestor, or `<DensityScope density fontScale asContext>`; `useDensity()`. Compact = xs controls, 24 px inputs, 11-12 px text x `--nb-font-scale`. Popups opened inside a DensityScope inherit it. |
| Button sizes | `xs`, `sm`, `md`, `lg`, `icon`, `icon-xs`. |
| IconButton | `aria-label` (required), `icon`, `size` xs/sm/md, `tooltip` (default the label, `false` = none), `pressed`, plus Button props. |
| SegmentedControl | `items` ({value,label,icon?,tooltip?,disabled?}), `value`, `onValueChange`, `label` (group name), `iconOnly`, `size`. |
| Select / DropdownMenu / Popover / Sheet parts | See CHANGELOG 0.6.0 for the part list; roots are `SelectRoot`, `DropdownMenuRoot`, `PopoverRoot`, `SheetRoot`. Props follow the shadcn Base UI wrappers (`SelectTrigger size`, `DropdownMenuItem variant="destructive"`, `SheetContent side showCloseButton`, ...). Menu labels must sit inside a `*Group`. |
| ContextMenu | `items`: `{label,onClick,icon,shortcut,danger,disabled,checked,children}` or `{type:'separator'}` / `{type:'label',label}`; `disabled` turns the trigger into a plain wrapper. |
| toast | `toast({id,kind,title,message,description,action,actions,progress,timeout})` returns the id; same id replaces in place; `toast.update(id,patch)`; `.dismiss(id)`, `.dismissAll()`, `.error/.success/.info/.warning(message,title?,opts?)`. Kinds: info, success, warning, error, running (sticky). Render `<ToastHost max/>` once (or `ToastProvider`). |
| CSS entry points | `@nbrain/ui/styles.css` (all) or `@nbrain/ui/styles/base.css` + only the component files you use: `radial`, `tabstrip`, `choice`, `window`, `widgets`, `production`. |

## Action boundary

`WidgetView.onAction(action, id?)` reports intent. Action names currently include execute, files-selected, inspect, save, send-message, fit, export, approve and revise. `send-message` uses the second argument for submitted text. The host maps these intents to its existing command/MCP/aiohttp system. No action is automatically approved by this package.

The initial common router is useful for visual migration. For strongly typed feature-specific execution, prefer the individual components and adapters around your existing domain commands. Do not use free-form string actions as a substitute for your application’s command types.

## Accessible states

Headless controls and modal/menu primitives use Base UI. Numeric and joystick controls offer keyboard alternatives. Error/offline states expose meaningful status/alert text. The demo hides inert thumbnail controls from assistive technology and provides one focusable open button per card.

Tree rows use standard disclosure and selection buttons; they are not an ARIA treeview implementation with roving arrow-key navigation. The schedule and graph are presentation compositions; production dragging, ports, virtualized lists and engine shortcuts remain with the host. Do not advertise them as complete feature engines.
