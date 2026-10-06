import { createFileRoute, Link } from "@tanstack/react-router";
import heroArena from "@/assets/hero-arena.jpg";
import ashfallMap from "@/assets/ashfall-map.jpg";
import { team, updates } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SBR Studio — Built by players, guarded by SBR" },
      { name: "description", content: "After your match: appeal a ban, contact support, report a member or staff, read updates, and meet the SBR team." },
      { property: "og:title", content: "SBR Studio — Built by players, guarded by SBR" },
      { property: "og:description", content: "Appeal bans, contact support, report players or staff, and read the latest SBR updates." },
    ],
  }),
  component: Index,
});

const actions = [
  { to: "/appeal", n: "01", title: "Ban Appeal", body: "Think a suspension was wrong? File a case and a moderator reviews the match replay.", cta: "Open a case →", text: "text-volt", bg: "bg-volt/10", hover: "hover:border-volt/50" },
  { to: "/support", n: "02", title: "Contact Support", body: "Billing, account recovery, or a bug that won't quit — reach a real SBR agent.", cta: "Start a ticket →", text: "text-plasma", bg: "bg-plasma/10", hover: "hover:border-plasma/50" },
  { to: "/report", n: "03", title: "Report Member or Staff", body: "Name a player or a staff account and attach the match ID for a confidential review.", cta: "File a report →", text: "text-coral", bg: "bg-coral/10", hover: "hover:border-coral/50" },
] as const;

function Index() {
  const main = updates[0]!;
  const rest = updates.slice(1);
  return (
    <main className="relative mx-auto max-w-6xl px-6 pb-28">
      <section className="grid items-center gap-8 pt-16 md:grid-cols-2 md:pt-24">
        <div className="animate-rise">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-edge bg-panel/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-volt">
            <span className="size-1.5 rounded-full bg-volt animate-glow" />
            Season 4 · live now
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-balance md:text-7xl">
            Built by players.
            <br />
            <span className="bg-gradient-to-r from-plasma via-volt to-volt bg-clip-text text-transparent">
              Guarded by SBR.
            </span>
          </h1>
          <p className="mt-6 max-w-[46ch] text-pretty leading-relaxed text-dim">
            The studio behind SBR — a competitive arena where every match is watched, every report
            answered, and every ban appeal gets a human.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#actions" className="rounded-xl bg-gradient-to-r from-plasma to-volt px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--volt)] transition-transform hover:-translate-y-0.5">
              Open the console
            </a>
            <Link to="/updates" className="rounded-xl border border-edge bg-panel px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-plasma/60">
              Patch notes
            </Link>
          </div>
        </div>
        <div className="animate-rise [animation-delay:120ms]">
          <img src={heroArena} alt="SBR esports arena stage" width={1008} height={768} className="aspect-[4/3] w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section id="actions" className="mt-20 scroll-mt-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">(a) Player actions</div>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">Where do you need us?</h2>
          </div>
          <span className="hidden font-mono text-[11px] text-dim sm:inline">avg. reply · 2h 14m</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {actions.map((a) => (
            <Link key={a.to} to={a.to} className={`group rounded-2xl border border-edge bg-panel/70 p-6 backdrop-blur-md transition-colors ${a.hover}`}>
              <div className={`mb-6 grid size-11 place-items-center rounded-xl font-mono text-lg font-bold ${a.bg} ${a.text}`}>{a.n}</div>
              <h3 className="font-display text-lg font-bold tracking-tight">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dim">{a.body}</p>
              <span className={`mt-5 inline-flex font-mono text-[11px] uppercase tracking-[0.15em] ${a.text}`}>{a.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="mb-6 flex items-end justify-between">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">(b) Game updates</div>
          <Link to="/updates" className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim hover:text-volt">All notes →</Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="overflow-hidden rounded-2xl border border-edge bg-panel/70 backdrop-blur-md lg:col-span-2">
            <div className="grid sm:grid-cols-2">
              <img src={ashfallMap} alt="Ashfall map" width={912} height={736} loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
              <div className="p-6">
                <div className="flex gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-dim">
                  <span className="text-volt">{main.version}</span>
                  <span>{main.date}</span>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-balance">{main.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dim">{main.body}</p>
              </div>
            </div>
          </article>
          <div className="grid gap-4">
            {rest.slice(0, 2).map((u) => (
              <article key={u.version} className="rounded-2xl border border-edge bg-panel/70 p-5 backdrop-blur-md">
                <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim">
                  <span className="text-volt">{u.version}</span> · {u.date}
                </div>
                <h4 className="mt-2 font-display text-base font-bold tracking-tight">{u.title}</h4>
                <p className="mt-1 text-sm text-dim">{u.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 rounded-3xl border border-edge bg-panel/50 p-8 backdrop-blur-md md:p-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">(c) Credits</div>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">Who built SBR</h2>
          </div>
          <Link to="/credits" className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim hover:text-volt">Full credits →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.name} className="flex items-center gap-3">
              <div>
                <div className="font-display text-sm font-bold tracking-tight">{m.name}</div>
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-dim">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
