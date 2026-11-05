import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { sendTicket } from "@/lib/tickets.functions";

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
  const [busy, setBusy] = useState(false);
  const send = useServerFn(sendTicket);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const kind = accent === "coral" ? "Report" : accent === "plasma" ? "Support" : "Ban appeal";
    const proof = (fd.getAll("proof") as File[]).filter((f) => f.size > 0);
    const total = proof.reduce((s, f) => s + f.size, 0);
    if (proof.length > 5 || total > 10 * 1024 * 1024) {
      toast.error("Proof is too big: max 5 files and 10 MB in total.");
      return;
    }
    const body = new FormData();
    body.append("kind", kind);
    body.append(
      "fields",
      JSON.stringify(fields.map((f) => ({ label: f.label, value: String(fd.get(f.name) ?? "") }))),
    );
    proof.forEach((f) => body.append("proof", f));
    setBusy(true);
    try {
      const res = await send({ data: body });
      if (!res.ok) throw new Error();
      setSent(true);
      toast.success(successMessage);
      form.reset();
    } catch {
      toast.error("Could not send right now. Please try again later.");
    } finally {
      setBusy(false);
    }
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
        <label className="block sm:col-span-2">
          <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.06em] text-dim">
            Proof (pictures or videos)
          </span>
          <input
            name="proof"
            type="file"
            multiple
            accept="image/*,video/*"
            className={`${inputCls} file:mr-4 file:rounded-lg file:border-0 file:bg-panel file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-foreground`}
          />
          <span className="mt-1 block text-xs text-dim">Optional · up to 5 files, 10 MB total</span>
        </label>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-[11px] text-dim">
          {sent ? "✓ Received — we'll reply by email" : "avg. reply · 2h 14m"}
        </span>
        <button
          type="submit"
          disabled={busy}
          className={`brick-btn rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 ${accentBtn[accent]}`}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
