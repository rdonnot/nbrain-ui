# Changelog

## 0.6.0

App-integration release (everything the N'Brain app needs before it can drop its own Base UI wrappers).

- **Density.** `data-nbrain-density="compact"` on any ancestor (or `<DensityScope density="compact" fontScale={1.1}>`) gives xs-sized controls: 24 px buttons/inputs/selects (`--nb-space-control`), 11-12 px text multiplied by `--nb-font-scale` (the host's per-widget font scale), compact menus and tab strips. `DensityScope` also reaches popups opened from inside it (they render in a portal). New `Button` sizes `xs` and `icon-xs`. BREAKING (minor): the root `compact` density is now 24 px, it was 36 px.
- **Compound parts** for Select, DropdownMenu, Popover and Sheet with the part names and props of the usual shadcn/Base UI wrappers: `SelectRoot, SelectTrigger(size), SelectValue, SelectContent(side, align, alignItemWithTrigger...), SelectItem, SelectGroup, SelectLabel, SelectSeparator, SelectScroll{Up,Down}Button`; `DropdownMenu{Root,Portal,Trigger,Content,Group,Label(inset),Item(inset, variant),CheckboxItem,RadioGroup,RadioItem,Separator,Shortcut,Sub,SubTrigger,SubContent}`; `Popover{Root,Trigger,Content,Header,Title,Description}`; `Sheet{Root,Trigger,Close,Portal,Overlay,Content(side, showCloseButton),Header,Footer,Title,Description}`. Roots are `XRoot` because `Select`, `DropdownMenu`, `Popover` and `Sheet` remain the one-shot components.
- **IconButton** (`aria-label` is a required prop, built-in tooltip, `pressed`) and **SegmentedControl** (radio semantics, roving arrows, icon items, per-item tooltips, `iconOnly`, sizes xs/sm/md).
- **ContextMenu** (non-radial) takes rich entries: separators, labels, icons, shortcuts, checkable, danger, disabled, submenus. **Toasts**: a module store `toast({id, kind, title, message, description, actions, progress, timeout})` with update-in-place (`toast.update`), replace-by-id, `toast.dismiss/dismissAll`, `toast.error/success/info/warning`, per-kind default timeouts, `<ToastHost max>` and `useToasts()`. `ToastProvider` and `useToast` still work.
- **Smaller stylesheet.** `@nbrain/ui/styles.css` is unchanged (everything). New `@nbrain/ui/styles/{base,radial,tabstrip,choice,window,widgets,production}.css`: `base.css` carries tokens, reset and every primitive; import the others only when you use RadialMenu, TabStrip, ChoiceCard, GlassPanel/FloatingWindow, the widget views, or the production composites.
- Hygiene: regenerated `package-lock.json` (it pinned `@jridgewell/trace-mapping ^0.3.34`, which does not exist); `verify-radial` waits long enough for the orbit animation; new `verify-v06` test.

## 0.3.3

- Restored center value dragging; parameter centers no longer navigate Back. Nested command centers retain Back.
- Added compact and full display modes, with shared inline/floating demo selection and preserved values.
- Changed the inner lens to translucent frosted glass and reduced the large dark backing disc.

## 0.3.2

- Satellite sliders support direct relative dragging, precision modifiers, keyboard adjustment and cancellation without a press-time value jump.
- Inner sections support icons and nested category rings, with center Back navigation.
- Added a matching frosted agent prompt pill and a host callback carrying the current inspector context; async failure preserves the draft.

## 0.3.1

- Added right-click, keyboard and touch-hold context triggers. Movement, scroll and multi-touch cancel pending holds.
- Inspector opens with the inner ring only. Desktop hover selects sections and contextual sliders/swatches; touch uses tap. Multi-control sections expand the outer orbit.
- Added hover intent, Back/Escape collapse, reopen reset and progressive gesture tests.

## 0.3.0

- Added reference-led circular inspector, orbital controls, central precision/hue dial, floating inspector, and compatible command radial menu.
- Added Oxanium 300/400/500/600/700 weight samples and stronger light/bold typography contrast.

- Added a separate ESM library build, declaration files, widgets subpath, isolated namespaced CSS, optional fonts and packaged identity asset.
- Added NBrainProvider, parameter/numeric controls, consistent widget chrome and recovery states.
- Extracted all 74 original registry entries and created a searchable atlas with individual responsive/state/usage/contract previews.
- Added controlled widget views and explicit engine slots. Kept fixture data and atlas navigation outside the library import graph.
- Added package consumer verification, widget checks, CI, integration documentation and UX priorities.

## 0.2.0

- Improved floating smoked glass, bevel/elevation, active window focus, component core glow and existing-app adoption patch.

## 0.1.0

- Initial component atelier and visual system.
