import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  kind: z.enum(["Report", "Ban appeal", "Support"]),
  fields: z
    .array(z.object({ label: z.string().max(100), value: z.string().max(1000) }))
    .max(20),
});

const colors = { Report: 0xe5533d, "Ban appeal": 0xddf60e, Support: 0x06bfcb };

export const sendTicket = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    const url = process.env["DISCORD_WEBHOOK_URL"];
    if (!url) return { ok: false, error: "Not configured yet" };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: `New ${data.kind}`,
            color: colors[data.kind],
            timestamp: new Date().toISOString(),
            fields: data.fields
              .filter((f) => f.value.trim())
              .map((f) => ({ name: f.label, value: f.value.slice(0, 1000), inline: f.value.length < 40 })),
          },
        ],
      }),
    });
    if (!res.ok) {
      console.error("Discord webhook failed", res.status, await res.text());
      return { ok: false, error: "Could not send" };
    }
    return { ok: true };
  });
