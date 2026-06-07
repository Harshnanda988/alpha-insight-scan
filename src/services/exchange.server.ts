import * as ccxt from "ccxt";

/**
 * Exchange Service (Server-side)
 * Responsibilities: CCXT integration, Multi-exchange fallback, Symbol normalization.
 */

const EXCHANGES_PRIORITY = ["binance", "bybit", "bitget", "okx", "mexc"];

// Cache for exchange instances to avoid re-instantiation
const instances: Record<string, any> = {};
// Cache for loaded markets to avoid redundant loadMarkets calls
const marketsLoaded: Record<string, boolean> = {};

function getExchangeInstance(id: string) {
  if (!instances[id]) {
    const ExchangeClass = (ccxt as any)[id];
    if (ExchangeClass) {
      instances[id] = new ExchangeClass({
        timeout: 10000,
        enableRateLimit: true,
      });
    }
  }
  return instances[id];
}

export const exchangeService = {
  /**
   * Ensure markets are loaded for an exchange
   */
  async ensureMarketsLoaded(exchangeId: string) {
    const exchange = getExchangeInstance(exchangeId);
    if (!exchange) return false;

    if (!marketsLoaded[exchangeId]) {
      try {
        await exchange.loadMarkets();
        marketsLoaded[exchangeId] = true;
      } catch (error) {
        console.error(`Error loading markets for ${exchangeId}:`, (error as any).message);
        return false;
      }
    }
    return true;
  },

  /**
   * Attempt to find an exchange that supports the given symbol and fetch OHLCV data.
   */
  async fetchOHLCVWithFallback(symbol: string, timeframe: string = "1d", limit: number = 500) {
    const normalizedSymbol = symbol.toUpperCase();
    const trySymbols = [
      `${normalizedSymbol}/USDT`,
      `${normalizedSymbol}/USDC`,
      `${normalizedSymbol}/BTC`,
    ];

    for (const exchangeId of EXCHANGES_PRIORITY) {
      const exchange = getExchangeInstance(exchangeId);
      if (!exchange) continue;

      try {
        // Use the optimized market loading
        const loaded = await this.ensureMarketsLoaded(exchangeId);
        if (!loaded) continue;

        for (const pair of trySymbols) {
          if (exchange.markets[pair]) {
            // console.log(`Found ${pair} on ${exchangeId}`);
            const ohlcv = await exchange.fetchOHLCV(pair, timeframe, undefined, limit);
            return {
              exchange: exchangeId,
              pair,
              data: ohlcv, // [timestamp, open, high, low, close, volume]
            };
          }
        }
      } catch (error) {
        // console.error(`Error fetching from ${exchangeId}:`, (error as any).message);
        continue;
      }
    }

    return null;
  },

  /**
   * Get basic ticker info with fallback
   */
  async fetchTickerWithFallback(symbol: string) {
    const normalizedSymbol = symbol.toUpperCase();
    const trySymbols = [`${normalizedSymbol}/USDT`, `${normalizedSymbol}/USDC`];

    for (const exchangeId of EXCHANGES_PRIORITY) {
      const exchange = getExchangeInstance(exchangeId);
      if (!exchange) continue;

      try {
        await exchange.loadMarkets();
        for (const pair of trySymbols) {
          if (exchange.markets[pair]) {
            const ticker = await exchange.fetchTicker(pair);
            return {
              exchange: exchangeId,
              pair,
              price: ticker.last,
              change24h: ticker.percentage,
              volume: ticker.quoteVolume,
            };
          }
        }
      } catch (error) {
        continue;
      }
    }
    return null;
  }
};
