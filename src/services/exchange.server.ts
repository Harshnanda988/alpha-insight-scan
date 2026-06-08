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
  try {
    if (!instances[id]) {
      console.log(`[exchangeService] Initializing exchange instance: ${id}`);
      const ExchangeClass = (ccxt as any)[id];
      if (ExchangeClass) {
        instances[id] = new ExchangeClass({
          timeout: 10000,
          enableRateLimit: true,
        });
      } else {
        console.warn(`[exchangeService] Exchange class not found for: ${id}`);
      }
    }
    return instances[id];
  } catch (e) {
    console.error(`[exchangeService] Critical error initializing exchange ${id}:`, e);
    return null;
  }
}

export const exchangeService = {
  /**
   * Ensure markets are loaded for an exchange
   */
  async ensureMarketsLoaded(exchangeId: string) {
    console.log(`[exchangeService] ensureMarketsLoaded START - exchange: ${exchangeId}`);
    try {
      const exchange = getExchangeInstance(exchangeId);
      if (!exchange) {
        console.error(`[exchangeService] FAILURE - Could not get instance for ${exchangeId}`);
        return false;
      }

      if (!marketsLoaded[exchangeId]) {
        try {
          await exchange.loadMarkets();
          marketsLoaded[exchangeId] = true;
          console.log(`[exchangeService] SUCCESS - Markets loaded for ${exchangeId}`);
        } catch (error: any) {
          console.error(`[exchangeService] FAILURE - Error loading markets for ${exchangeId}:`, error.message);
          if (error instanceof Error) {
            console.error(`[exchangeService] Stack Trace for ${exchangeId}:`, error.stack);
          }
          return false;
        }
      }
      return true;
    } catch (error: any) {
      console.error(`[exchangeService] Unexpected error in ensureMarketsLoaded for ${exchangeId}:`, error);
      return false;
    }
  },

  /**
   * Attempt to find an exchange that supports the given symbol and fetch OHLCV data.
   */
  async fetchOHLCVWithFallback(symbol: string, timeframe: string = "1d", limit: number = 500) {
    console.log(`[exchangeService] fetchOHLCVWithFallback START - symbol: ${symbol}, tf: ${timeframe}`);
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
            console.log(`[exchangeService] Found ${pair} on ${exchangeId}. Fetching OHLCV...`);
            const ohlcv = await exchange.fetchOHLCV(pair, timeframe, undefined, limit);
            console.log(`[exchangeService] SUCCESS - Fetched OHLCV from ${exchangeId}`);
            return {
              exchange: exchangeId,
              pair,
              data: ohlcv, // [timestamp, open, high, low, close, volume]
            };
          }
        }
      } catch (error) {
        console.warn(`[exchangeService] Error fetching from ${exchangeId}:`, (error as any).message);
        continue;
      }
    }

    console.warn(`[exchangeService] FAILURE - No exchange found for ${symbol}`);
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
