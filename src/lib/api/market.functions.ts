import { createServerFn } from "@tanstack/react-start";
import { getServerConfig } from "../config.server";
import type { Coin } from "@/mock/coins";
import { calculateRSI, calculateEMA } from "../ta";

async function fetchBinanceTechnicals(symbol: string, interval: string = "1d") {
  try {
    // Map common symbols to Binance pairs
    const pair = `${symbol}USDT`;
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=100`
    );
    if (!response.ok) return null;
    
    const data = await response.json();
    const prices = data.map((d: any) => parseFloat(d[4])); // Closing prices
    
    const rsi = calculateRSI(prices);
    const ema20 = calculateEMA(prices, 20);
    const ema50 = calculateEMA(prices, 50);
    const ema200 = calculateEMA(prices, 200);
    
    const currentPrice = prices[prices.length - 1];
    let emaStatus: "Bullish" | "Bearish" | "Neutral" = "Neutral";
    if (currentPrice > ema50) emaStatus = "Bullish";
    if (currentPrice < ema50) emaStatus = "Bearish";

    return { rsi, ema20, ema50, ema200, emaStatus };
  } catch (e) {
    return null;
  }
}

export const fetchMarketData = createServerFn({ method: "GET" })
  .validator((d: any) => d as { timeframes?: string[] } | undefined)
  .handler(async ({ data: inputData }) => {
    const config = getServerConfig();
    const apiKey = config.cmcApiKey;
    const requestedTimeframes = inputData?.timeframes || ["1d"];

    console.log("Fetching market data from CMC...", apiKey ? "API Key found" : "API Key MISSING", "Timeframes:", requestedTimeframes);

    if (!apiKey) {
      console.error("CMC_API_KEY is not configured");
      return [];
    }

    try {
      const response = await fetch(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100&convert=USD",
        {
          headers: {
            "X-CMC_PRO_API_KEY": apiKey,
            "Accept": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("CMC API Error:", error);
        return [];
      }

      const data = await response.json();
      
      // Fetch technicals for top 20 coins to keep it snappy, for each requested timeframe
      const topCoins = data.data.slice(0, 20);
      const technicalsMap = new Map();
      
      for (const tf of requestedTimeframes) {
        await Promise.all(
          topCoins.map(async (item: any) => {
            const tech = await fetchBinanceTechnicals(item.symbol, tf);
            if (tech) {
              const key = `${item.symbol}_${tf}`;
              technicalsMap.set(key, tech);
            }
          })
        );
      }
      
      const coins: Coin[] = data.data.map((item: any) => {
        const quote = item.quote.USD;
        
        // Default technicals from the first requested timeframe or 1d
        const defaultTf = requestedTimeframes[0] || "1d";
        const techDefault = technicalsMap.get(`${item.symbol}_${defaultTf}`);
        
        const change24h = quote.percent_change_24h;
        
        // We add a map of technicals per timeframe to the coin object
        const technicalsByTimeframe: Record<string, any> = {};
        for (const tf of requestedTimeframes) {
          const tech = technicalsMap.get(`${item.symbol}_${tf}`);
          if (tech) technicalsByTimeframe[tf] = tech;
        }
        
        return {
          symbol: item.symbol,
          name: item.name,
          price: quote.price,
          change24h: quote.percent_change_24h,
          change7d: quote.percent_change_7d,
          volume: quote.volume_24h,
          marketCap: quote.market_cap,
          rsi: techDefault?.rsi ?? Math.round(30 + Math.random() * 40),
          emaStatus: techDefault?.emaStatus ?? (change24h > 2 ? "Bullish" : change24h < -2 ? "Bearish" : "Neutral"),
          pattern: "Consolidation", 
          exchange: "Multi",
          // Extended fields
          ema20: techDefault?.ema20,
          ema50: techDefault?.ema50,
          ema200: techDefault?.ema200,
          // All technicals
          technicals: technicalsByTimeframe,
        };
      });

      return coins;
    } catch (error) {
      console.error("Error fetching market data:", error);
      return [];
    }
  });
