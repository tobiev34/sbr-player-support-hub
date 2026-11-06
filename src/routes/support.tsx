import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, TicketForm } from "@/components/TicketForm";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Appeal Roles — SBR Studio" },
      { name: "description", content: "Want a role in SBR? Appeal for content creator, tester, mod, staff, or dev." },
      { property: "og:title", content: "Appeal Roles — SBR Studio" },
      { property: "og:description", content: "Appeal for a role in the SBR team." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <main className="relative mx-auto grid max-w-6xl gap-10 px-6 pt-16 pb-28 lg:grid-cols-[0.8fr_1.2fr]">
      <PageIntro eyebrow="02 · Appeal roles" title="Appeal for a role" accent="plasma">
        Want to join the SBR team? Pick the role you're applying for and tell us why.
      </PageIntro>
      <TicketForm
        accent="plasma"
        submitLabel="Send ticket"
        successMessage="Ticket sent — support will reply soon."
        fields={[
          { name: "username", label: "DC name", placeholder: "Your Discord name" },
          { name: "email", label: "Email (optional)", type: "email", placeholder: "you@example.com", required: false },
          {
            name: "topic",
            label: "Topic",
            type: "select",
            options: ["Content creator", "Tester", "Lead tester", "In-game mod", "DC staff", "In-game dev"],
            subOptions: {
              "In-game dev": ["Scripter", "VFX artist", "Modeller", "Builder", "UI designer"],
            },
            subLabel: "Dev role",
          },
          { name: "subject", label: "Subject", placeholder: "Short summary" },
          { name: "message", label: "Message", type: "textarea", placeholder: "How can we help?" },
        ]}
      />
    </main>
  );
}
