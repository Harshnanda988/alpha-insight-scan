import { type Coin } from "@/mock/coins";
import type { Condition } from "@/store/scanner";
import { fetchMarketData } from "@/lib/api/market.functions";

export const scannerService = {
  async run(conditions: Condition[]): Promise<Coin[]> {
    const timeframes = Array.from(new Set(conditions.map((c) => c.timeframe)));
    
    // Step 1: Get all coins with market cap > $10M (Fast, no technicals yet)
    const baseCoins = await fetchMarketData({ data: { timeframes } } as any);
    
    // Step 2: Filter by non-technical fields first to reduce the workload
    // This makes the scan incredibly fast
    const candidateCoins = baseCoins.filter(c => {
      return conditions.every(cond => {
        if (["Volume", "Market Cap", "Price Change"].includes(cond.field)) {
          const comparisonType = cond.comparisonType || "value";
          if (comparisonType !== "value") return true;
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

    // Step 3: Fetch technicals ONLY for candidates (On-demand)
    // We limit this to the top 500 candidates to ensure stability while providing broad coverage
    const finalCandidates = candidateCoins.slice(0, 500);
    const symbols = finalCandidates.map(c => c.symbol);
    
    // If no symbols passed the market cap/volume/price filters, we can stop here
    if (symbols.length === 0) return [];

    const coinsWithTech = await fetchMarketData({ data: { timeframes, symbols, conditions } } as any);
    
    // Step 4: Final filter with technicals
    return coinsWithTech.filter((c) => {
      let matches = true;
      
      for (let i = 0; i < conditions.length; i++) {
        const cond = conditions[i];
        
        const tech = c.technicals?.[cond.timeframe] || {};
        const comparisonType = cond.comparisonType || "value";
        
        // Get left side value
        let leftVal: number | null = null;
        
        if (["Volume", "Market Cap", "Price Change"].includes(cond.field)) {
          const fieldMap: Record<string, number> = {
            Volume: c.volume,
            "Market Cap": c.marketCap,
            "Price Change": c.change24h,
          };
          leftVal = fieldMap[cond.field] ?? null;
        } else if (cond.field === "RSI") {
          leftVal = tech.rsi ?? null;
        } else if (["EMA", "SMA"].includes(cond.field) && cond.indicatorPeriod) {
          const period = parseInt(cond.indicatorPeriod);
          if (!isNaN(period)) {
            const key = `${cond.field.toLowerCase()}${period}`;
            leftVal = tech[key] ?? null;
          }
        }
        
        // Get right side value
        let rightVal: number | null = null;
        if (comparisonType === "value") {
          rightVal = parseFloat(cond.value);
        } else if (comparisonType === "price") {
          rightVal = tech.currentPrice ?? c.price;
        } else if (comparisonType === "indicator" && cond.comparisonIndicator && cond.comparisonIndicatorPeriod) {
          const period = parseInt(cond.comparisonIndicatorPeriod);
          if (!isNaN(period)) {
            const key = `${cond.comparisonIndicator.toLowerCase()}${period}`;
            rightVal = tech[key] ?? null;
          }
        }
        
        // If either side is null, condition doesn't match
        let condMatch = false;
        if (leftVal !== null && rightVal !== null) {
          switch (cond.operator) {
            case "<": condMatch = leftVal < rightVal; break;
            case ">": condMatch = leftVal > rightVal; break;
            case "<=": condMatch = leftVal <= rightVal; break;
            case ">=": condMatch = leftVal >= rightVal; break;
            case "=": condMatch = Math.abs(leftVal - rightVal) < 0.0001; break;
            case "crosses_above": condMatch = leftVal > rightVal && c.change24h > 0; break;
            case "crosses_below": condMatch = leftVal < rightVal && c.change24h < 0; break;
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
      
      // Handle RSI
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
          comparisonType: "value",
        });
      }
      
      // Handle EMA (including custom periods like "EMA 15"
      const emaMatch = part.match(/ema[^\d]*(\d+)/);
      if (part.includes("ema") && emaMatch) {
        const period = emaMatch[1];
        let operator: any = ">";
        let comparisonType: "value" | "price" | "indicator" = "price";
        
        if (part.includes("cross")) {
          operator = part.includes("cross above") || part.includes("crosses above") ? "crosses_above" : "crosses_below";
        } else if (part.includes("below") || part.includes("<")) {
          operator = "<";
        }
        
        out.push({
          id: id(),
          field: "EMA",
          indicatorPeriod: period,
          operator: operator,
          value: "0",
          logic: out.length > 0 ? "AND" : "AND",
          timeframe: partTf,
          comparisonType: comparisonType,
        });
      }
      
      // Handle SMA (including custom periods)
      const smaMatch = part.match(/sma[^\d]*(\d+)/);
      if (part.includes("sma") && smaMatch) {
        const period = smaMatch[1];
        let operator: any = ">";
        let comparisonType: "value" | "price" | "indicator" = "price";
        
        if (part.includes("cross")) {
          operator = part.includes("cross above") || part.includes("crosses above") ? "crosses_above" : "crosses_below";
        } else if (part.includes("below") || part.includes("<")) {
          operator = "<";
        }
        
        out.push({
          id: id(),
          field: "SMA",
          indicatorPeriod: period,
          operator: operator,
          value: "0",
          logic: out.length > 0 ? "AND" : "AND",
          timeframe: partTf,
          comparisonType: comparisonType,
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
          comparisonType: "value",
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
          comparisonType: "value",
        });
      }
    }

    if (out.length === 0) {
      out.push({ id: id(), field: "RSI", operator: ">", value: "60", logic: "AND", timeframe: "1d", comparisonType: "value" });
    }
    return out;
  },
};
