import { createServerFn } from "@tanstack/react-start";
import { type Coin } from "@/mock/coins";
import { indicatorService } from "@/services/indicator.service";
import type { Condition } from "@/store/scanner";

async function getTechnicals(symbol: string, interval: string = "1d", conditions?: Condition[]) {
  console.log(`[getTechnicals] START - symbol: ${symbol}, tf: ${interval}`);
  try {
    // Dynamic import using relative path for Vercel server function compatibility
    const { exchangeService } = await import("../../services/exchange.server.js");
    
    const ohlcvResult = await exchangeService.fetchOHLCVWithFallback(symbol, interval);
    if (!ohlcvResult || !ohlcvResult.data) {
      console.warn(`[getTechnicals] FAILURE - No OHLCV data for ${symbol}`);
      return null;
    }

    const prices = ohlcvResult.data.map((d: any) => d[4]); // Closing prices
    const currentPrice = prices[prices.length - 1];

    // Calculate all required indicators
    const techData: any = { prices, currentPrice };
    
    // Always calculate default indicators for backward compatibility
    techData.rsi = indicatorService.calculateRSI(prices);
    techData.ema20 = indicatorService.calculateEMA(prices, 20);
    techData.ema50 = indicatorService.calculateEMA(prices, 50);
    techData.ema200 = indicatorService.calculateEMA(prices, 200);
    techData.sma50 = indicatorService.calculateSMA(prices, 50);
    techData.sma200 = indicatorService.calculateSMA(prices, 200);
    
    // Calculate custom indicators from conditions if provided
    if (conditions) {
      const relevantConditions = conditions.filter(c => 
        ["EMA", "SMA"].includes(c.field) || 
        (c.comparisonType === "indicator" && ["EMA", "SMA"].includes(c.comparisonIndicator || ""))
      );
      
      for (const cond of relevantConditions) {
        // Calculate main indicator
        if (["EMA", "SMA"].includes(cond.field) && cond.indicatorPeriod) {
          const period = parseInt(cond.indicatorPeriod);
          if (!isNaN(period)) {
            const key = `${cond.field.toLowerCase()}${period}`;
            if (!techData[key]) {
              techData[key] = cond.field === "EMA" 
                ? indicatorService.calculateEMA(prices, period)
                : indicatorService.calculateSMA(prices, period);
            }
          }
        }
        
        // Calculate comparison indicator
        if (cond.comparisonType === "indicator" && cond.comparisonIndicator && cond.comparisonIndicatorPeriod) {
          const period = parseInt(cond.comparisonIndicatorPeriod);
          if (!isNaN(period)) {
            const key = `${cond.comparisonIndicator.toLowerCase()}${period}`;
            if (!techData[key]) {
              techData[key] = cond.comparisonIndicator === "EMA"
                ? indicatorService.calculateEMA(prices, period)
                : indicatorService.calculateSMA(prices, period);
            }
          }
        }
      }
    }

    // Determine EMA status
    let emaStatus: "Bullish" | "Bearish" | "Neutral" = "Neutral";
    if (techData.ema50 && currentPrice > techData.ema50) emaStatus = "Bullish";
    if (techData.ema50 && currentPrice < techData.ema50) emaStatus = "Bearish";
    techData.emaStatus = emaStatus;
    techData.exchange = ohlcvResult.exchange;
    techData.pair = ohlcvResult.pair;

    console.log(`[getTechnicals] SUCCESS - symbol: ${symbol}`);
    return techData;
  } catch (e) {
    console.error(`[getTechnicals] FAILURE - Unexpected Error for ${symbol}:`, e);
    return null;
  }
}

export const fetchMarketData = createServerFn({ method: "POST" })
  .validator((d: any) => d as { timeframes?: string[]; symbols?: string[]; conditions?: Condition[] } | undefined)
  .handler(async ({ data: inputData }) => {
    const requestedTimeframes = inputData?.timeframes || ["1d"];
    const targetSymbols = inputData?.symbols;
    const conditions = inputData?.conditions;

    console.log(`[fetchMarketData] START - Fetching data for ${targetSymbols?.length || "all"} coins, TF: ${requestedTimeframes}`);

    try {
      // Dynamic imports using relative paths for Vercel server function compatibility
      const { cmcService } = await import("../../services/cmc.service.js");
      const { exchangeService } = await import("../../services/exchange.server.js");

      // Step 0: Warm up exchange markets (Parallel)
      if (targetSymbols && targetSymbols.length > 0) {
        console.log(`[fetchMarketData] Warming up exchanges for ${targetSymbols.length} symbols...`);
        const EXCHANGES_PRIORITY = ["binance", "bybit", "bitget", "okx", "mexc"];
        try {
          await Promise.all(EXCHANGES_PRIORITY.map(id => exchangeService.ensureMarketsLoaded(id)));
          console.log(`[fetchMarketData] Exchanges warmed up`);
        } catch (e) {
          console.warn(`[fetchMarketData] Exchange warmup partial failure:`, e);
        }
      }

      // Step 1: Discover coins via CoinMarketCap
      const topCoins = await cmcService.getTopCoins(1000);
      if (!topCoins || topCoins.length === 0) {
        console.warn(`[fetchMarketData] No coins discovered via CMC`);
        return [];
      }
      
      const technicalsMap = new Map();
      
      // Step 2: On-demand technicals via CCXT Fallback
      if (targetSymbols && targetSymbols.length > 0) {
        console.log(`[fetchMarketData] Fetching technicals for ${targetSymbols.length} candidate coins...`);
        const chunkSize = 25; // Increased chunk size for better parallelism
        for (const tf of requestedTimeframes) {
          for (let i = 0; i < targetSymbols.length; i += chunkSize) {
            const chunk = targetSymbols.slice(i, i + chunkSize);
            
            if (i > 0) await new Promise(r => setTimeout(r, 50)); // Further reduced delay

            await Promise.all(
              chunk.map(async (symbol: string) => {
                try {
                  const techPromise = getTechnicals(symbol, tf, conditions);
                  const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Timeout")), 10000) // Increased timeout to 10s
                  );
                  
                  const tech = await Promise.race([techPromise, timeoutPromise]) as any;
                  if (tech) {
                    technicalsMap.set(`${symbol}_${tf}`, tech);
                  }
                } catch (e) {
                  // Silent fail for individual coins
                  console.warn(`[fetchMarketData] Failed to fetch technicals for ${symbol}:`, e);
                }
              })
            );
          }
        }
        console.log(`[fetchMarketData] Finished fetching technicals. Found data for ${technicalsMap.size} combinations.`);
      }
      
      // Map back to Coin objects
      // If targetSymbols is provided, we only return those symbols to save bandwidth
      const filteredTopCoins = targetSymbols && targetSymbols.length > 0
        ? topCoins.filter((item: any) => targetSymbols.includes(item.symbol))
        : topCoins;

      const coins: Coin[] = filteredTopCoins.map((item: any) => {
        const defaultTf = requestedTimeframes[0] || "1d";
        const techDefault = technicalsMap.get(`${item.symbol}_${defaultTf}`);
        
        const technicalsByTimeframe: Record<string, any> = {};
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
          technicals: technicalsByTimeframe,
        };
      });

      console.log(`[fetchMarketData] SUCCESS - Returning ${coins.length} coins`);
      return coins;
    } catch (error: any) {
      console.error("[fetchMarketData] FAILURE - Unexpected Error:", error);
      if (error instanceof Error) {
        console.error("[fetchMarketData] Stack Trace:", error.stack);
      }
      return [];
    }
  });
