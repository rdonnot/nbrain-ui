/**
 * src/components/ui/Modal.tsx
 *
 * The modal shell. One implementation.
 *
 * StartupModal, UserModal and ProjectModal each grew their own copy of: the
 * backdrop, the blur, click-outside-to-close, the Escape handler, the motion
 * variants, the reduced-motion branch, the tab bar with its animated underline,
 * the input class, the error banner, the empty state, the spinner. Three copies
 * that had already begun to disagree on padding, radius and z-index.
 *
 * This is the same failure as the three project-slug functions and the two
 * setActiveProject()s: not that duplication is inelegant, but that copies DRIFT,
 * and you find out which one is wrong from a bug report.
 *
 *   <Modal onClose={close} size="lg">
 *     <ModalTabs id="project" tabs={TABS} active={tab} onChange={setTab} onClose={close} />
 *     <ModalBody>…</ModalBody>
 *   </Modal>
 *
 * NOT for alert/confirm dialogs — that is AppModalHost + lib/appModal, which is
 * imperative (`await confirm(...)`) and a genuinely different shape. Two families,
 * two components; the mistake was having three of THIS one.
 */

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X, Loader2, TriangleAlert, type LucideIcon } from "lucide-react";

import { Dialog as D } from "@base-ui/react/dialog";

type Size = "sm" | "md" | "lg";

/**
 * FIXED width AND height — not max-*.
 *
 * The first version set only `max-h`, so the card shrink-wrapped its content: the
 * Profile tab is short, the Team tab is tall, and the modal JUMPED SIZE on every
 * tab switch. Tabs are meant to swap what is inside a stable frame; a frame that
 * resizes to fit makes the tab strip itself move under the cursor.
 *
 * StartupModal got this right by accident — it pins h-[min(88vh,660px)] — which
 * is exactly why it was the one that looked correct.
 *
 * The viewport min() keeps them usable on a laptop and on a phone. ModalBody
 * scrolls inside, so a tall tab overflows rather than growing the shell.
 */
const SIZE: Record<Size, string> = {
  sm: "w-[min(94vw,480px)] h-[min(88vh,520px)]",
  md: "w-[min(94vw,620px)] h-[min(88vh,640px)]",
  lg: "w-[min(94vw,880px)] h-[min(88vh,700px)]",
};

/** Keeps the legacy mount/unmount API; Base UI owns modal focus and dismissal. */
export function Modal({ onClose, size = "md", dismissable = true, title = "n’brain", children }: {
  onClose: () => void; size?: Size; dismissable?: boolean;
  /** Supply a localized, meaningful title at each call site. */
  title?: string; children: ReactNode;
}) {
  return <D.Root open disablePointerDismissal={!dismissable} onOpenChange={(open, details) => {
    if (!dismissable) { details.cancel(); return; }
    if (!open) onClose();
  }}><D.Portal>
    <D.Backdrop className="nbrain-modal-backdrop" />
    <D.Popup className={"nbrain-modal-popup " + SIZE[size]}>
      <D.Title className="sr-only">{title}</D.Title>
      {children}
    </D.Popup>
  </D.Portal></D.Root>;
}

export interface ModalTab<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
}

/**
 * The tab strip. `id` namespaces the animated underline: motion's `layoutId` is
 * GLOBAL, so two open modals sharing one id would animate the underline flying
 * between them across the screen.
 *
 * CALL IT WITH THE TYPE ARGUMENT:  <ModalTabs<Tab> … />
 *
 * TypeScript will not reliably infer `T` from `tabs: readonly ModalTab<T>[]` in
 * JSX — it widens to `string`, and then rejects your `Dispatch<SetStateAction<Tab>>`
 * because it is not `(t: string) => void`. Pinning T at the call site is the fix;
 * casting onChange would silence the error and lose the very type-safety the
 * generic exists for.
 */
export function ModalTabs<T extends string>({
  id, tabs, active, onChange, onClose,
}: {
  id: string;
  tabs: readonly ModalTab<T>[];
  active: T;
  onChange: (t: T) => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-line px-4 pt-3">
      <div className="flex gap-0.5">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onChange(t.id)}
            className={
              "relative flex items-center gap-1.5 px-3 pb-2.5 pt-1 text-[0.8125rem] font-medium transition-colors " +
              (t.id === active ? "text-fg" : "text-fg-3 hover:text-fg-2")
            }>
            <t.icon className="h-[14px] w-[14px]" />
            {t.label}
            {t.id === active && (
              <motion.span layoutId={`${id}-tab-underline`}
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-acc" />
            )}
          </button>
        ))}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Close"
          className="mb-1 rounded-md p-1.5 text-fg-3 transition-colors hover:bg-raised hover:text-fg">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/** Scrolling content area. The modal itself must not scroll — the tabs stay put. */
export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>;
}

// ── Form primitives ──────────────────────────────────────────────────────────

export const INPUT =
  "h-10 w-full rounded-lg border border-line bg-raised px-3 text-sm text-fg " +
  "placeholder:text-fg-3 outline-none transition-colors " +
  "focus-visible:border-acc-border focus-visible:ring-2 focus-visible:ring-acc-ring " +
  "disabled:opacity-50";

/** The inline-style twin of INPUT, for FolderPickerInput (which takes a style
 *  object, not a className). Kept HERE so the two cannot drift apart. */
export const INPUT_STYLE: React.CSSProperties = {
  height: 40, width: "100%", minWidth: 0,
  borderRadius: 8,
  border: "1px solid var(--line)",
  background: "var(--raised)",
  padding: "0 12px",
  fontSize: 14, color: "var(--fg)", outline: "none",
};

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[0.7rem] font-medium uppercase tracking-wide text-fg-3">
      {children}
    </div>
  );
}

export function Field({ label, icon: Icon, children }: {
  label: string; icon?: LucideIcon; children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-wide text-fg-3">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </label>
      {children}
    </div>
  );
}

/** Server errors are shown VERBATIM wherever this is used. The backend's guards
 *  send real sentences ("This is the only administrator. Promote someone else
 *  first.") and replacing those with "Something went wrong" throws away the only
 *  thing that tells the user what to do next.
 *
 *  `shake` is for a REJECTED ACTION the user must retry now — a wrong password.
 *  A quiet banner is right for "that didn't save"; a wrong password wants to be
 *  felt. Respects prefers-reduced-motion. */
export function ErrorBanner({ children, shake }: {
  children: ReactNode;
  shake?: boolean;
}) {
  const reduce = useReducedMotion();
  if (!children) return null;

  const CLS = "flex items-start gap-1.5 rounded-lg border border-danger-border " +
              "bg-danger-soft px-2.5 py-2 text-xs text-danger-text";

  if (!shake) {
    return (
      <div className={CLS}>
        <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" />
        <span>{children}</span>
      </div>
    );
  }
  return (
    <motion.div
      role="alert"
      className={CLS}
      initial={{ opacity: 0 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, x: [0, -7, 7, -4, 4, 0] }}
      transition={{ duration: reduce ? 0.2 : 0.45 }}
    >
      <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </motion.div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="py-10 text-center text-sm text-fg-3">{children}</div>;
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-fg-3">
      <Loader2 className="h-4 w-4 animate-spin" /> {label}
    </div>
  );
}

/** The one primary button, so "Create project" and "Save profile" cannot end up
 *  different heights on different screens. */
export function PrimaryButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest}
      className={
        "inline-flex h-11 items-center justify-center gap-1.5 rounded-lg " +
        "bg-acc text-sm font-semibold text-acc-fg " +
        "shadow-lg shadow-acc/25 transition-all hover:brightness-110 active:translate-y-px " +
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none " +
        (rest.className ?? "")
      }>
      {children}
    </button>
  );
}
