import { getServerConfig } from "@/lib/config.server";

/**
 * CoinMarketCap Service
 * Responsibilities: Fetching coin metadata, market cap, and rankings from CMC.
 */

const BASE_URL = "https://pro-api.coinmarketcap.com/v1";

export const cmcService = {
  /**
   * Fetch all coins by market cap (> $10M)
   * CMC free tier allows up to 5000 per request, but we'll fetch 1000 to be safe and fast.
   */
  async getTopCoins(limit: number = 1000, minMarketCap: number = 10000000) {
    console.log(`[cmcService] getTopCoins START - limit: ${limit}, minMC: ${minMarketCap}`);
    const config = getServerConfig();
    const apiKey = config.cmcApiKey;

    if (!apiKey) {
      console.error("[cmcService] FAILURE - CMC_API_KEY is not configured");
      return [];
    }

    try {
      // Fetch up to 1000 coins in one go
      const url = `${BASE_URL}/cryptocurrency/listings/latest?limit=${limit}&convert=USD&market_cap_min=${minMarketCap}&sort=market_cap&sort_dir=desc`;
      console.log(`[cmcService] Fetching from: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        let errorDetails = "";
        try {
          const errorJson = await response.json();
          errorDetails = JSON.stringify(errorJson);
        } catch (e) {
          errorDetails = response.statusText;
        }
        console.error(`[cmcService] FAILURE - CMC API error (${response.status}): ${errorDetails}`);
        return [];
      }

      const data = await response.json();
      if (!data || !data.data) {
        console.error("[cmcService] FAILURE - Invalid response structure from CMC");
        return [];
      }
      
      console.log(`[cmcService] SUCCESS - Fetched ${data.data.length} coins`);
      
      return data.data.map((coin: any) => ({
        id: coin.id.toString(),
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.quote.USD.price,
        marketCap: coin.quote.USD.market_cap,
        volume: coin.quote.USD.volume_24h,
        change24h: coin.quote.USD.percent_change_24h,
        change7d: coin.quote.USD.percent_change_7d,
        image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
      }));
    } catch (error) {
      console.error("[cmcService] FAILURE - Unexpected Error:", error);
      return [];
    }
  }
};
