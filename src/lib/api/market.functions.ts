import { createServerFn } from "@tanstack/react-start";
import { getServerConfig } from "../config.server";
import type { Coin } from "@/mock/coins";
import { indicatorService } from "@/services/indicator.service";
import { exchangeService } from "@/services/exchange.server";
import { cmcService } from "@/services/cmc.service";

async function getTechnicals(symbol: string, interval: string = "1d") {
  try {
    const ohlcvResult = await exchangeService.fetchOHLCVWithFallback(symbol, interval);
    if (!ohlcvResult || !ohlcvResult.data) return null;

    const prices = ohlcvResult.data.map((d: any) => d[4]); // Closing prices
    
    const rsi = indicatorService.calculateRSI(prices);
    const ema20 = indicatorService.calculateEMA(prices, 20);
    const ema50 = indicatorService.calculateEMA(prices, 50);
    const ema200 = indicatorService.calculateEMA(prices, 200);
    const sma50 = indicatorService.calculateSMA(prices, 50);
    const sma200 = indicatorService.calculateSMA(prices, 200);
    
    const currentPrice = prices[prices.length - 1];
    let emaStatus: "Bullish" | "Bearish" | "Neutral" = "Neutral";
    if (ema50 && currentPrice > ema50) emaStatus = "Bullish";
    if (ema50 && currentPrice < ema50) emaStatus = "Bearish";

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
    return null;
  }
}

export const fetchMarketData = createServerFn({ method: "POST" })
  .validator((d: any) => d as { timeframes?: string[]; symbols?: string[] } | undefined)
  .handler(async ({ data: inputData }) => {
    const requestedTimeframes = inputData?.timeframes || ["1d"];
    const targetSymbols = inputData?.symbols;

    console.log(`[MarketData] Fetching data for ${targetSymbols?.length || "all"} coins, TF: ${requestedTimeframes}`);

    try {
      // Step 0: Warm up exchange markets (Parallel)
      if (targetSymbols && targetSymbols.length > 0) {
        console.log(`[MarketData] Warming up exchanges for ${targetSymbols.length} symbols...`);
        const EXCHANGES_PRIORITY = ["binance", "bybit", "bitget", "okx", "mexc"];
        await Promise.all(EXCHANGES_PRIORITY.map(id => exchangeService.ensureMarketsLoaded(id)));
      }

      // Step 1: Discover coins via CoinMarketCap
      const topCoins = await cmcService.getTopCoins(1000);
      
      const technicalsMap = new Map();
      
      // Step 2: On-demand technicals via CCXT Fallback
      if (targetSymbols && targetSymbols.length > 0) {
        console.log(`[MarketData] Fetching technicals for ${targetSymbols.length} candidate coins...`);
        const chunkSize = 25; // Increased chunk size for better parallelism
        for (const tf of requestedTimeframes) {
          for (let i = 0; i < targetSymbols.length; i += chunkSize) {
            const chunk = targetSymbols.slice(i, i + chunkSize);
            
            if (i > 0) await new Promise(r => setTimeout(r, 50)); // Further reduced delay

            await Promise.all(
              chunk.map(async (symbol: string) => {
                try {
                  const techPromise = getTechnicals(symbol, tf);
                  const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Timeout")), 10000) // Increased timeout to 10s
                  );
                  
                  const tech = await Promise.race([techPromise, timeoutPromise]) as any;
                  if (tech) {
                    technicalsMap.set(`${symbol}_${tf}`, tech);
                  }
                } catch (e) {
                  // Silent fail for individual coins
                }
              })
            );
          }
        }
        console.log(`[MarketData] Finished fetching technicals. Found data for ${technicalsMap.size} combinations.`);
      }
      
      // Map back to Coin objects
      // If targetSymbols is provided, we only return those symbols to save bandwidth
      const filteredTopCoins = targetSymbols && targetSymbols.length > 0
        ? topCoins.filter(item => targetSymbols.includes(item.symbol))
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

      return coins;
    } catch (error) {
      console.error("Error in fetchMarketData:", error);
      return [];
    }
  });
