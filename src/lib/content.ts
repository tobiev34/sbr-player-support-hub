import weaponBat from "@/assets/first-weapon-bat.png.asset.json";

export const team = [
  { name: "RUNITBACK", role: "OWNER" },
  { name: "NEXI", role: "OWNER" },
  { name: "MYSOUL", role: "COMUNITY LEADER" },
  { name: "ALBERT", role: "DC LEADER" },
  { name: "....", role: "Community Manager" },
  { name: "....", role: "Concept Artist" },
  { name: "....", role: "Gameplay Programmer" },
  { name: "....", role: "Sound Designer" },
];

export type Update = { version: string; date: string; title: string; body: string; image?: string };

export const updates: Update[] = [
  {
    version: "sneak peek",
    date: "nov 03",
    title: "First weapon in game",
    body: "A first look at the very first weapon coming to SBR: a spiked, burlap-wrapped bat — with a little bird riding along.",
    image: weaponBat.url,
  },
];
