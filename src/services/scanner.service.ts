import { type Coin } from "@/mock/coins";
import type { Condition } from "@/store/scanner";
import { marketService } from "./market.service";

export const scannerService = {
  async run(conditions: Condition[]): Promise<Coin[]> {
    const timeframes = Array.from(new Set(conditions.map((c) => c.timeframe)));
    const coins = await marketService.getAll(timeframes);
    
    return coins.filter((c) => {
      // AND logic: all conditions must match
      // OR logic: at least one condition must match
      // For simplicity in this UI, we treat all as AND if they are AND, or check sequential logic
      
      let matches = true;
      
      for (let i = 0; i < conditions.length; i++) {
        const cond = conditions[i];
        const value = parseFloat(cond.value);
        
        // Get field value for the specific timeframe
        const tech = c.technicals?.[cond.timeframe] || {};
        const fieldMap: Record<string, number> = {
          RSI: tech.rsi ?? c.rsi,
          EMA20: tech.ema20 ?? c.ema20 ?? c.price,
          EMA50: tech.ema50 ?? c.ema50 ?? c.price,
          EMA200: tech.ema200 ?? c.ema200 ?? c.price,
          Volume: c.volume,
          "Market Cap": c.marketCap,
          "Price Change": c.change24h,
        };
        
        const fv = fieldMap[cond.field] ?? 0;
        let condMatch = false;
        
        switch (cond.operator) {
          case "<": condMatch = fv < value; break;
          case ">": condMatch = fv > value; break;
          case "<=": condMatch = fv <= value; break;
          case ">=": condMatch = fv >= value; break;
          case "=": condMatch = Math.abs(fv - value) < 0.0001; break;
          case "crosses_above": condMatch = fv > value && c.change24h > 0; break;
          case "crosses_below": condMatch = fv < value && c.change24h < 0; break;
        }

        if (i === 0) {
          matches = condMatch;
        } else {
          if (cond.logic === "AND") {
            matches = matches && condMatch;
          } else {
            matches = matches || condMatch;
          }
        }
      }
      
      return matches;
    });
  },

  async parseNaturalLanguage(prompt: string): Promise<Condition[]> {
    await new Promise((r) => setTimeout(r, 800));
    const p = prompt.toLowerCase();
    const out: Condition[] = [];
    const id = () => crypto.randomUUID();

    // Helper to detect timeframe
    const getTimeframe = (s: string): any => {
      if (s.includes("weekly") || s.includes("1w")) return "1w";
      if (s.includes("monthly") || s.includes("1m")) return "1M";
      if (s.includes("hourly") || s.includes("1h")) return "1h";
      if (s.includes("4h") || s.includes("4 hour")) return "4h";
      return "1d"; // default
    };

    const timeframe = getTimeframe(p);

    // Split by "and" or "," to handle multiple conditions
    const parts = p.split(/ and |,| plus /);

    for (const part of parts) {
      const partTf = getTimeframe(part) || timeframe;
      
      if (part.includes("rsi")) {
        const m = part.match(/rsi[^\d]*(\d+)/);
        const v = m ? m[1] : "60";
        out.push({
          id: id(),
          field: "RSI",
          operator: part.includes("below") || part.includes("oversold") || part.includes("<") ? "<" : ">",
          value: v,
          logic: out.length > 0 ? "AND" : "AND",
          timeframe: partTf,
        });
      }
      if (part.includes("ema50") || part.includes("ema 50")) {
        out.push({
          id: id(),
          field: "EMA50",
          operator: part.includes("cross") ? "crosses_above" : (part.includes("below") ? "<" : ">"),
          value: part.includes("above") || part.includes("below") || part.includes("cross") ? "0" : "50",
          logic: out.length > 0 ? "AND" : "AND",
          timeframe: partTf,
        });
      }
      if (part.includes("ema200") || part.includes("ema 200")) {
        out.push({
          id: id(),
          field: "EMA200",
          operator: part.includes("cross") ? "crosses_above" : (part.includes("below") ? "<" : ">"),
          value: "0",
          logic: out.length > 0 ? "AND" : "AND",
          timeframe: partTf,
        });
      }
      if (part.includes("volume")) {
        out.push({
          id: id(),
          field: "Volume",
          operator: ">",
          value: "100000000",
          logic: out.length > 0 ? "AND" : "AND",
          timeframe: partTf,
        });
      }
      if (part.includes("change") || part.includes("gain") || part.includes("up")) {
        const m = part.match(/(\d+)/);
        const v = m ? m[1] : "5";
        out.push({
          id: id(),
          field: "Price Change",
          operator: ">",
          value: v,
          logic: out.length > 0 ? "AND" : "AND",
          timeframe: partTf,
        });
      }
    }

    if (out.length === 0) {
      out.push({ id: id(), field: "RSI", operator: ">", value: "50", logic: "AND", timeframe: "1d" });
    }
    return out;
  },
};
