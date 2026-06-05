import { COINS, type Coin } from "@/mock/coins";

export const marketService = {
  async getAll(): Promise<Coin[]> {
    await new Promise((r) => setTimeout(r, 120));
    return COINS;
  },
  async getTopGainers(limit = 5): Promise<Coin[]> {
    return [...COINS].sort((a, b) => b.change24h - a.change24h).slice(0, limit);
  },
  async getTopLosers(limit = 5): Promise<Coin[]> {
    return [...COINS].sort((a, b) => a.change24h - b.change24h).slice(0, limit);
  },
};
