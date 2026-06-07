import { type Coin } from "@/mock/coins";
import { fetchMarketData } from "@/lib/api/market.functions";

export const marketService = {
  async getAll(timeframes?: string[], symbols?: string[]): Promise<Coin[]> {
    try {
      const coins = await fetchMarketData({ data: { timeframes, symbols } });
      return coins;
    } catch (error) {
      console.error("Failed to fetch market data:", error);
      return [];
    }
  },
  async getTopGainers(limit = 5): Promise<Coin[]> {
    const coins = await this.getAll();
    return [...coins].sort((a, b) => b.change24h - a.change24h).slice(0, limit);
  },
  async getTopLosers(limit = 5): Promise<Coin[]> {
    const coins = await this.getAll();
    return [...coins].sort((a, b) => a.change24h - b.change24h).slice(0, limit);
  },
};
