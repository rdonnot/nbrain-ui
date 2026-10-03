# Component inventory

89 exported components/providers/hooks. The review board groups them into 12 visual sections.

## Circular inspector

- `RadialInspector`
- `RadialInspectorOverlay`
- `RadialInspectorContextMenu`
- `RotaryDial`
- `RadialMenu`

## System

- `NBrainProvider`
- `ParameterRow`
- `NumericScrub`
- `WidgetFrame`
- `DockPicker`
- `ConnectionBanner`

## Widget views

- `WidgetView`
- `SliderWidget`
- `FaderWidget`
- `NumericWidget`
- `ButtonWidget`
- `ToggleWidget`
- `TextWidget`
- `ColorWidget`
- `JoystickWidget`
- `CurveWidget`
- `ScopeWidget`
- `AssetGridWidget`
- `TreeWidget`
- `QueueWidget`
- `ChatWidget`
- `EngineViewport`
- `MeterWidget`
- `TransformWidget`

## Actions

- `Button`
- `ToggleGroup`
- `Kbd`

## Forms

- `Input`
- `Textarea`
- `Field`
- `Switch`
- `Checkbox`
- `Slider`
- `Select`
- `Combobox`
- `NumberInput`
- `RadioGroup`
- `Calendar`
- `DatePicker`
- `FileUpload`

## Surfaces

- `Card`
- `Separator`
- `ScrollArea`

## Navigation

- `Tabs`
- `Breadcrumb`
- `Pagination`
- `DropdownMenu`
- `ContextMenu`
- `Accordion`
- `Collapsible`

## Overlays

- `Dialog`
- `Sheet`
- `Popover`
- `Tooltip`
- `TooltipProvider`
- `CommandPalette`

## Feedback

- `Badge`
- `Skeleton`
- `Progress`
- `Alert`
- `Empty`
- `ToastProvider`
- `useToast`

## People and data

- `Avatar`
- `AvatarGroup`
- `DataTable`
- `Sparkline`

## Production

- `FloatingWindow`
- `WindowCanvas`
- `Wordmark`
- `BrandIcon`
- `AgentCore`
- `AgentCard`
- `AgentOrchestrator`
- `GlassProjectCard`
- `ApprovalGate`
- `ShotCard`
- `MediaTransport`
- `Timeline`
- `ResourceMeter`
- `ConnectionStatus`
- `ActivityFeed`
- `PromptComposer`
- `Metric`

## Primary contracts

| Component | Inputs / behavior |
|---|---|
| Button | variant: primary, silver, secondary, outline, ghost, destructive; size: sm, md, lg, icon; loading and native button props |
| Select / Combobox | controlled value, onValueChange / onChange, options / items, accessible label |
| Dialog / Sheet | controlled open, onOpenChange, title, description, children; Base UI modal focus management |
| DataTable | typed rows, column render functions, rowKey, filterText; internal search, sort, selection |
| AgentOrchestrator | Agent[]: id, name, task, status, optional progress; onSelect |
| ApprovalGate | approved, onApprove, onRevise; no autonomous approval or server side effects |
| MediaTransport | playing, onPlay, time (seconds), onSeek |
| Timeline | position (seconds), onSeek; presentation clip model |
| PromptComposer | onSend(text); parent owns actual backend dispatch |
| ToastProvider | application provider; useToast()(title, description) |

The TS source is authoritative for the complete props. This is a reusable application foundation, not a replacement for Lexical, Blender/ComfyUI, 3D, map, audio, or pixel-streaming engines.
