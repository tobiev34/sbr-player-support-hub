import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  kind: z.enum(["Report", "Ban appeal", "Support"]),
  fields: z
    .array(z.object({ label: z.string().max(100), value: z.string().max(1000) }))
    .max(20),
});

const colors = { Report: 0xe5533d, "Ban appeal": 0xddf60e, Support: 0x06bfcb };

// Accept / Decline buttons. Clicks are handled by /api/public/discord-interactions.
const decisionButtons = [
  {
    type: 1,
    components: [
      { type: 2, style: 3, label: "Accept", emoji: { name: "✅" }, custom_id: "ticket:accept" },
      { type: 2, style: 4, label: "Decline", emoji: { name: "❌" }, custom_id: "ticket:decline" },
    ],
  },
];

export const sendTicket = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    const embed = {
      title: `New ${data.kind}`,
      color: colors[data.kind],
      timestamp: new Date().toISOString(),
      fields: [
        ...data.fields
          .filter((f) => f.value.trim())
          .map((f) => ({ name: f.label, value: f.value.slice(0, 1000), inline: f.value.length < 40 })),
        { name: "Status", value: "⏳ Waiting for staff", inline: false },
      ],
    };
    const firstValue = (data.fields.find((f) => f.value.trim())?.value ?? "new").slice(0, 60);
    const threadName = `${data.kind}: ${firstValue}`;

    const botToken = process.env["DISCORD_BOT_TOKEN"];
    const channelId = process.env["DISCORD_CHANNEL_ID"];

    // Preferred: send through the bot so the message can carry Accept / Decline buttons.
    if (botToken && channelId) {
      const api = (path: string, init?: RequestInit) =>
        fetch(`https://discord.com/api/v10${path}`, {
          ...init,
          headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" },
        });
      const message = { allowed_mentions: { parse: [] }, embeds: [embed], components: decisionButtons };

      const chRes = await api(`/channels/${channelId}`);
      if (!chRes.ok) {
        console.error("Discord channel lookup failed", chRes.status, await chRes.text());
        return { ok: false, error: "Could not send" };
      }
      const channel = (await chRes.json()) as { type: number };
      const isForum = channel.type === 15 || channel.type === 16;
      const res = isForum
        ? await api(`/channels/${channelId}/threads`, {
            method: "POST",
            body: JSON.stringify({ name: threadName, message }),
          })
        : await api(`/channels/${channelId}/messages`, { method: "POST", body: JSON.stringify(message) });
      if (!res.ok) {
        console.error("Discord bot send failed", res.status, await res.text());
        return { ok: false, error: "Could not send" };
      }
      return { ok: true };
    }

    // Fallback: plain webhook (no buttons).
    const url = process.env["DISCORD_WEBHOOK_URL"];
    if (!url) return { ok: false, error: "Not configured yet" };
    const payload = { allowed_mentions: { parse: [] }, embeds: [embed] };
    const post = (body: object) =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    let res = await post(payload);
    if (res.status === 400) {
      const err = await res.text();
      if (err.includes("220001")) {
        res = await post({ ...payload, thread_name: threadName });
      } else {
        console.error("Discord webhook failed", res.status, err);
        return { ok: false, error: "Could not send" };
      }
    }
    if (!res.ok) {
      console.error("Discord webhook failed", res.status, await res.text());
      return { ok: false, error: "Could not send" };
    }
    return { ok: true };
  });
