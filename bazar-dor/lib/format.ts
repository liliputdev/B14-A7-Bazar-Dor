const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export const toBn = (v: string | number) => String(v).replace(/\d/g, (d) => BN[+d]);

export const UNIT_BN = { kg: "কেজি", litre: "লিটার", dozen: "ডজন", piece: "পিস" } as const;

export const formatTaka = (n: number) => `${new Intl.NumberFormat("bn-BD").format(n)} টাকা`;

export const formatPct = (pct: number) => toBn(Math.abs(pct).toFixed(1)) + "%";

export const arrow = (dir: "up" | "down" | "flat") =>
  dir === "up" ? "▲" : dir === "down" ? "▼" : "—";

export const tickerColor = (dir: "up" | "down" | "flat") =>
  dir === "up" ? "text-red-600" : dir === "down" ? "text-green-600" : "text-gray-500";

export const banglaDate = () =>
  new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });