import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./server-BecFIFJv.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const indicatorService = {
  /**
   * Calculate Relative Strength Index (RSI)
   */
  calculateRSI(prices, period = 14) {
    if (prices.length <= period) return null;
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= period; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }
    let avgGain = gains / period;
    let avgLoss = losses / period;
    for (let i = period + 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) {
        avgGain = (avgGain * (period - 1) + diff) / period;
        avgLoss = avgLoss * (period - 1) / period;
      } else {
        avgGain = avgGain * (period - 1) / period;
        avgLoss = (avgLoss * (period - 1) - diff) / period;
      }
    }
    if (avgLoss === 0) return avgGain === 0 ? 50 : 100;
    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    if (isNaN(rsi)) return 50;
    return parseFloat(rsi.toFixed(2));
  },
  /**
   * Calculate Exponential Moving Average (EMA)
   */
  calculateEMA(prices, period) {
    if (prices.length < period) return null;
    const k = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    for (let i = period; i < prices.length; i++) {
      ema = prices[i] * k + ema * (1 - k);
    }
    return parseFloat(ema.toFixed(2));
  },
  /**
   * Calculate Simple Moving Average (SMA)
   */
  calculateSMA(prices, period) {
    if (prices.length < period) return null;
    const slice = prices.slice(prices.length - period);
    const sum = slice.reduce((a, b) => a + b, 0);
    return parseFloat((sum / period).toFixed(2));
  },
  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  calculateMACD(prices, fast = 12, slow = 26, signal = 9) {
    const emaFast = this.calculateEMA(prices, fast);
    const emaSlow = this.calculateEMA(prices, slow);
    if (emaFast === null || emaSlow === null) return null;
    const macdLine = emaFast - emaSlow;
    return {
      macd: parseFloat(macdLine.toFixed(2)),
      emaFast,
      emaSlow
    };
  }
};
async function getTechnicals(symbol, interval = "1d") {
  console.log(`[getTechnicals] START - symbol: ${symbol}, tf: ${interval}`);
  try {
    const {
      exchangeService
    } = await import("./exchange.server-waL9_gvB.mjs");
    const ohlcvResult = await exchangeService.fetchOHLCVWithFallback(symbol, interval);
    if (!ohlcvResult || !ohlcvResult.data) {
      console.warn(`[getTechnicals] FAILURE - No OHLCV data for ${symbol}`);
      return null;
    }
    const prices = ohlcvResult.data.map((d) => d[4]);
    const rsi = indicatorService.calculateRSI(prices);
    const ema20 = indicatorService.calculateEMA(prices, 20);
    const ema50 = indicatorService.calculateEMA(prices, 50);
    const ema200 = indicatorService.calculateEMA(prices, 200);
    const sma50 = indicatorService.calculateSMA(prices, 50);
    const sma200 = indicatorService.calculateSMA(prices, 200);
    const currentPrice = prices[prices.length - 1];
    let emaStatus = "Neutral";
    if (ema50 && currentPrice > ema50) emaStatus = "Bullish";
    if (ema50 && currentPrice < ema50) emaStatus = "Bearish";
    console.log(`[getTechnicals] SUCCESS - symbol: ${symbol}`);
    return {
      rsi,
      ema20,
      ema50,
      ema200,
      sma50,
      sma200,
      emaStatus,
      exchange: ohlcvResult.exchange,
      pair: ohlcvResult.pair
    };
  } catch (e) {
    console.error(`[getTechnicals] FAILURE - Unexpected Error for ${symbol}:`, e);
    return null;
  }
}
const fetchMarketData_createServerFn_handler = createServerRpc({
  id: "184428904420acb50b081828d8aed22ec91bea12ee676672715105c90973c3ff",
  name: "fetchMarketData",
  filename: "src/lib/api/market.functions.ts"
}, (opts) => fetchMarketData.__executeServer(opts));
const fetchMarketData = createServerFn({
  method: "POST"
}).validator((d) => d).handler(fetchMarketData_createServerFn_handler, async ({
  data: inputData
}) => {
  const requestedTimeframes = inputData?.timeframes || ["1d"];
  const targetSymbols = inputData?.symbols;
  console.log(`[fetchMarketData] START - Fetching data for ${targetSymbols?.length || "all"} coins, TF: ${requestedTimeframes}`);
  try {
    const {
      cmcService
    } = await import("./cmc.service-2a1nKaCJ.mjs");
    const {
      exchangeService
    } = await import("./exchange.server-waL9_gvB.mjs");
    if (targetSymbols && targetSymbols.length > 0) {
      console.log(`[fetchMarketData] Warming up exchanges for ${targetSymbols.length} symbols...`);
      const EXCHANGES_PRIORITY = ["binance", "bybit", "bitget", "okx", "mexc"];
      try {
        await Promise.all(EXCHANGES_PRIORITY.map((id) => exchangeService.ensureMarketsLoaded(id)));
        console.log(`[fetchMarketData] Exchanges warmed up`);
      } catch (e) {
        console.warn(`[fetchMarketData] Exchange warmup partial failure:`, e);
      }
    }
    const topCoins = await cmcService.getTopCoins(1e3);
    if (!topCoins || topCoins.length === 0) {
      console.warn(`[fetchMarketData] No coins discovered via CMC`);
      return [];
    }
    const technicalsMap = /* @__PURE__ */ new Map();
    if (targetSymbols && targetSymbols.length > 0) {
      console.log(`[fetchMarketData] Fetching technicals for ${targetSymbols.length} candidate coins...`);
      const chunkSize = 25;
      for (const tf of requestedTimeframes) {
        for (let i = 0; i < targetSymbols.length; i += chunkSize) {
          const chunk = targetSymbols.slice(i, i + chunkSize);
          if (i > 0) await new Promise((r) => setTimeout(r, 50));
          await Promise.all(chunk.map(async (symbol) => {
            try {
              const techPromise = getTechnicals(symbol, tf);
              const timeoutPromise = new Promise(
                (_, reject) => setTimeout(() => reject(new Error("Timeout")), 1e4)
                // Increased timeout to 10s
              );
              const tech = await Promise.race([techPromise, timeoutPromise]);
              if (tech) {
                technicalsMap.set(`${symbol}_${tf}`, tech);
              }
            } catch (e) {
              console.warn(`[fetchMarketData] Failed to fetch technicals for ${symbol}:`, e);
            }
          }));
        }
      }
      console.log(`[fetchMarketData] Finished fetching technicals. Found data for ${technicalsMap.size} combinations.`);
    }
    const filteredTopCoins = targetSymbols && targetSymbols.length > 0 ? topCoins.filter((item) => targetSymbols.includes(item.symbol)) : topCoins;
    const coins = filteredTopCoins.map((item) => {
      const defaultTf = requestedTimeframes[0] || "1d";
      const techDefault = technicalsMap.get(`${item.symbol}_${defaultTf}`);
      const technicalsByTimeframe = {};
      for (const tf of requestedTimeframes) {
        const tech = technicalsMap.get(`${item.symbol}_${tf}`);
        if (tech) technicalsByTimeframe[tf] = tech;
      }
      return {
        symbol: item.symbol,
        name: item.name,
        price: item.price,
        change24h: item.change24h,
        change7d: item.change7d,
        volume: item.volume,
        marketCap: item.marketCap,
        rsi: techDefault?.rsi ?? null,
        emaStatus: techDefault?.emaStatus ?? "N/A",
        pattern: "Consolidation",
        exchange: techDefault?.exchange ?? "Multi",
        ema20: techDefault?.ema20 ?? null,
        ema50: techDefault?.ema50 ?? null,
        ema200: techDefault?.ema200 ?? null,
        technicals: technicalsByTimeframe
      };
    });
    console.log(`[fetchMarketData] SUCCESS - Returning ${coins.length} coins`);
    return coins;
  } catch (error) {
    console.error("[fetchMarketData] FAILURE - Unexpected Error:", error);
    return [];
  }
});
export {
  fetchMarketData_createServerFn_handler
};
