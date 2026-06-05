import { COINS, type Coin } from "@/mock/coins";
import type { Condition } from "@/store/scanner";

export const scannerService = {
  async run(conditions: Condition[]): Promise<Coin[]> {
    await new Promise((r) => setTimeout(r, 350));
    return COINS.filter((c) =>
      conditions.every((cond) => {
        const value = parseFloat(cond.value);
        const fieldMap: Record<string, number> = {
          RSI: c.rsi,
          EMA20: c.price,
          EMA50: c.price,
          EMA200: c.price,
          Volume: c.volume,
          "Market Cap": c.marketCap,
          "Price Change": c.change24h,
        };
        const fv = fieldMap[cond.field] ?? 0;
        switch (cond.operator) {
          case "<":
            return fv < value;
          case ">":
            return fv > value;
          case "<=":
            return fv <= value;
          case ">=":
            return fv >= value;
          case "=":
            return Math.abs(fv - value) < 0.0001;
          case "crosses_above":
            return fv > value && c.change24h > 0;
          case "crosses_below":
            return fv < value && c.change24h < 0;
        }
      }),
    );
  },

  async parseNaturalLanguage(prompt: string): Promise<Condition[]> {
    await new Promise((r) => setTimeout(r, 800));
    const p = prompt.toLowerCase();
    const out: Condition[] = [];
    const id = () => crypto.randomUUID();

    if (p.includes("rsi")) {
      const m = p.match(/rsi[^\d]*(\d+)/);
      const v = m ? m[1] : "60";
      out.push({
        id: id(),
        field: "RSI",
        operator: p.includes("below") || p.includes("oversold") ? "<" : ">",
        value: v,
        logic: "AND",
      });
    }
    if (p.includes("ema50") || p.includes("ema 50")) {
      out.push({
        id: id(),
        field: "EMA50",
        operator: p.includes("cross") ? "crosses_above" : ">",
        value: "0",
        logic: "AND",
      });
    }
    if (p.includes("volume")) {
      out.push({
        id: id(),
        field: "Volume",
        operator: ">",
        value: "100000000",
        logic: "AND",
      });
    }
    if (p.includes("breakout") || p.includes("gain")) {
      out.push({
        id: id(),
        field: "Price Change",
        operator: ">",
        value: "5",
        logic: "AND",
      });
    }
    if (out.length === 0) {
      out.push({ id: id(), field: "RSI", operator: ">", value: "50", logic: "AND" });
    }
    return out;
  },
};
