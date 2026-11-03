import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
};

type Accent = "volt" | "plasma" | "coral";

const accentText: Record<Accent, string> = {
  volt: "text-volt",
  plasma: "text-plasma",
  coral: "text-coral",
};

const accentBtn: Record<Accent, string> = {
  volt: "bg-volt",
  plasma: "bg-plasma",
  coral: "bg-coral",
};

const inputCls =
  "w-full rounded-xl border-[3px] border-edge bg-background px-4 py-3 text-sm text-foreground placeholder:text-dim/70 outline-none transition-colors focus:border-volt/60";

export function PageIntro({
  eyebrow,
  title,
  children,
  accent = "volt",
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  accent?: Accent;
}) {
  return (
    <div className="animate-rise">
      <div className={`font-mono text-[11px] uppercase tracking-[0.08em] ${accentText[accent]}`}>
        {eyebrow}
      </div>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-[52ch] text-pretty leading-relaxed text-dim">{children}</p>
    </div>
  );
}

export function TicketForm({
  fields,
  submitLabel,
  successMessage,
  accent = "volt",
}: {
  fields: Field[];
  submitLabel: string;
  successMessage: string;
  accent?: Accent;
}) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    toast.success(successMessage);
    e.currentTarget.reset();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-edge bg-panel p-6 brick md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <label
            key={f.name}
            className={`block ${f.type === "textarea" ? "sm:col-span-2" : ""}`}
          >
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.06em] text-dim">
              {f.label}
              {f.required !== false && <span className={accentText[accent]}> *</span>}
            </span>
            {f.type === "textarea" ? (
              <textarea
                name={f.name}
                rows={5}
                required={f.required !== false}
                placeholder={f.placeholder}
                className={inputCls}
              />
            ) : f.type === "select" ? (
              <select
                name={f.name}
                required={f.required !== false}
                defaultValue=""
                className={inputCls}
              >
                <option value="" disabled>
                  Choose…
                </option>
                {f.options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                name={f.name}
                type={f.type ?? "text"}
                required={f.required !== false}
                placeholder={f.placeholder}
                className={inputCls}
              />
            )}
          </label>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-[11px] text-dim">
          {sent ? "✓ Received — we'll reply by email" : "avg. reply · 2h 14m"}
        </span>
        <button
          type="submit"
          className={`brick-btn rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 ${accentBtn[accent]}`}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
