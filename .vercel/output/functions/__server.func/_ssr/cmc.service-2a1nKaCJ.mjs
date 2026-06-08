import process from "node:process";
function getServerConfig() {
  console.log("[getServerConfig] Loading environment variables...");
  const config = {
    nodeEnv: process.env.NODE_ENV,
    cmcApiKey: process.env.CMC_API_KEY,
    cgApiKey: process.env.CG_API_KEY
  };
  console.log(`[getServerConfig] NODE_ENV: ${config.nodeEnv}`);
  console.log(`[getServerConfig] CMC_API_KEY: ${config.cmcApiKey ? "PRESENT (masked)" : "MISSING"}`);
  console.log(`[getServerConfig] CG_API_KEY: ${config.cgApiKey ? "PRESENT (masked)" : "MISSING"}`);
  if (process.env.NODE_ENV === "production") {
    if (!config.cmcApiKey) {
      console.error("[getServerConfig] CRITICAL: CMC_API_KEY is missing in production environment!");
    }
  }
  return config;
}
const BASE_URL = "https://pro-api.coinmarketcap.com/v1";
const cmcService = {
  /**
   * Fetch all coins by market cap (> $10M)
   * CMC free tier allows up to 5000 per request, but we'll fetch 1000 to be safe and fast.
   */
  async getTopCoins(limit = 1e3, minMarketCap = 1e7) {
    console.log(`[cmcService] getTopCoins START - limit: ${limit}, minMC: ${minMarketCap}`);
    const config = getServerConfig();
    const apiKey = config.cmcApiKey;
    if (!apiKey) {
      console.error("[cmcService] FAILURE - CMC_API_KEY is not configured");
      return [];
    }
    try {
      const url = `${BASE_URL}/cryptocurrency/listings/latest?limit=${limit}&convert=USD&market_cap_min=${minMarketCap}&sort=market_cap&sort_dir=desc`;
      console.log(`[cmcService] Fetching from: ${url}`);
      const response = await fetch(url, {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
          "Accept": "application/json"
        }
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
      return data.data.map((coin) => ({
        id: coin.id.toString(),
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.quote.USD.price,
        marketCap: coin.quote.USD.market_cap,
        volume: coin.quote.USD.volume_24h,
        change24h: coin.quote.USD.percent_change_24h,
        change7d: coin.quote.USD.percent_change_7d,
        image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`
      }));
    } catch (error) {
      console.error("[cmcService] FAILURE - Unexpected Error:", error);
      return [];
    }
  }
};
export {
  cmcService
};
