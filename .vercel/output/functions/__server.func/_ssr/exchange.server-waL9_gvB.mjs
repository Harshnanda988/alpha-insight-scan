import * as ccxt from "ccxt";
const EXCHANGES_PRIORITY = ["binance", "bybit", "bitget", "okx", "mexc"];
const instances = {};
const marketsLoaded = {};
function getExchangeInstance(id) {
  try {
    if (!instances[id]) {
      console.log(`[exchangeService] Initializing exchange instance: ${id}`);
      const ExchangeClass = ccxt[id];
      if (ExchangeClass) {
        instances[id] = new ExchangeClass({
          timeout: 1e4,
          enableRateLimit: true
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
const exchangeService = {
  /**
   * Ensure markets are loaded for an exchange
   */
  async ensureMarketsLoaded(exchangeId) {
    console.log(`[exchangeService] ensureMarketsLoaded START - exchange: ${exchangeId}`);
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
      } catch (error) {
        console.error(`[exchangeService] FAILURE - Error loading markets for ${exchangeId}:`, error.message);
        return false;
      }
    }
    return true;
  },
  /**
   * Attempt to find an exchange that supports the given symbol and fetch OHLCV data.
   */
  async fetchOHLCVWithFallback(symbol, timeframe = "1d", limit = 500) {
    console.log(`[exchangeService] fetchOHLCVWithFallback START - symbol: ${symbol}, tf: ${timeframe}`);
    const normalizedSymbol = symbol.toUpperCase();
    const trySymbols = [
      `${normalizedSymbol}/USDT`,
      `${normalizedSymbol}/USDC`,
      `${normalizedSymbol}/BTC`
    ];
    for (const exchangeId of EXCHANGES_PRIORITY) {
      const exchange = getExchangeInstance(exchangeId);
      if (!exchange) continue;
      try {
        const loaded = await this.ensureMarketsLoaded(exchangeId);
        if (!loaded) continue;
        for (const pair of trySymbols) {
          if (exchange.markets[pair]) {
            console.log(`[exchangeService] Found ${pair} on ${exchangeId}. Fetching OHLCV...`);
            const ohlcv = await exchange.fetchOHLCV(pair, timeframe, void 0, limit);
            console.log(`[exchangeService] SUCCESS - Fetched OHLCV from ${exchangeId}`);
            return {
              exchange: exchangeId,
              pair,
              data: ohlcv
              // [timestamp, open, high, low, close, volume]
            };
          }
        }
      } catch (error) {
        console.warn(`[exchangeService] Error fetching from ${exchangeId}:`, error.message);
        continue;
      }
    }
    console.warn(`[exchangeService] FAILURE - No exchange found for ${symbol}`);
    return null;
  },
  /**
   * Get basic ticker info with fallback
   */
  async fetchTickerWithFallback(symbol) {
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
              volume: ticker.quoteVolume
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
export {
  exchangeService
};
