import { type Coin } from "@/mock/coins";
import type { Condition } from "@/store/scanner";
import { marketService } from "./market.service";

export const scannerService = {
  async run(conditions: Condition[]): Promise<Coin[]> {
    const timeframes = Array.from(new Set(conditions.map((c) => c.timeframe)));
    
    // Step 1: Get all coins with market cap > $10M (Fast, no technicals yet)
    const baseCoins = await marketService.getAll(timeframes);
    
    // Step 2: Filter by non-technical fields first to reduce the workload
    // This makes the scan incredibly fast
    const candidateCoins = baseCoins.filter(c => {
      return conditions.every(cond => {
        if (["Volume", "Market Cap", "Price Change"].includes(cond.field)) {
          const value = parseFloat(cond.value);
          const fieldMap: Record<string, number> = {
            Volume: c.volume,
            "Market Cap": c.marketCap,
            "Price Change": c.change24h,
          };
          const fv = fieldMap[cond.field] ?? 0;
          switch (cond.operator) {
            case "<": return fv < value;
            case ">": return fv > value;
            case "<=": return fv <= value;
            case ">=": return fv >= value;
            case "=": return Math.abs(fv - value) < 0.0001;
            default: return true;
          }
        }
        return true;
      });
    });

    // Step 3: Fetch technicals ONLY for candidates (On-Demand)
    // We limit this to the top 500 candidates to ensure stability while providing broad coverage
    const finalCandidates = candidateCoins.slice(0, 500);
    const symbols = finalCandidates.map(c => c.symbol);
    
    // If no symbols passed the market cap/volume/price filters, we can stop here
    if (symbols.length === 0) return [];

    const coinsWithTech = await marketService.getAll(timeframes, symbols);
    
    // Step 4: Final filter with technicals
    return coinsWithTech.filter((c) => {
      let matches = true;
      
      for (let i = 0; i < conditions.length; i++) {
        const cond = conditions[i];
        const value = parseFloat(cond.value);
        
        const tech = c.technicals?.[cond.timeframe] || {};
        
        // Check if the field exists in technicals or the coin itself
        const isTechnicalField = ["RSI", "EMA20", "EMA50", "EMA200", "SMA50", "SMA200"].includes(cond.field);
        const fv = isTechnicalField 
          ? (tech[cond.field.toLowerCase()] ?? null)
          : (cond.field === "Volume" ? c.volume : cond.field === "Market Cap" ? c.marketCap : c.change24h);
        
        // If it's a technical field and value is null, it can't match any comparison
        let condMatch = false;
        if (isTechnicalField && fv === null) {
          condMatch = false;
        } else {
          const numFv = fv as number;
          switch (cond.operator) {
            case "<": condMatch = numFv < value; break;
            case ">": condMatch = numFv > value; break;
            case "<=": condMatch = numFv <= value; break;
            case ">=": condMatch = numFv >= value; break;
            case "=": condMatch = Math.abs(numFv - value) < 0.0001; break;
            case "crosses_above": condMatch = numFv > value && c.change24h > 0; break;
            case "crosses_below": condMatch = numFv < value && c.change24h < 0; break;
          }
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
