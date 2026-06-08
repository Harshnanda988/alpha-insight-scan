import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-CAwEBp9i.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./router-CsjDKZWR.mjs";
import { y as ArrowUp, z as ArrowDown } from "../_libs/lucide-react.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const fetchMarketData = createServerFn({
  method: "POST"
}).validator((d) => d).handler(createSsrRpc("184428904420acb50b081828d8aed22ec91bea12ee676672715105c90973c3ff"));
const marketService = {
  async getAll(timeframes, symbols) {
    try {
      const coins = await fetchMarketData({ data: { timeframes, symbols } });
      return coins;
    } catch (error) {
      console.error("Failed to fetch market data:", error);
      return [];
    }
  },
  async getTopGainers(limit = 5) {
    const coins = await this.getAll();
    return [...coins].sort((a, b) => b.change24h - a.change24h).slice(0, limit);
  },
  async getTopLosers(limit = 5) {
    const coins = await this.getAll();
    return [...coins].sort((a, b) => a.change24h - b.change24h).slice(0, limit);
  }
};
function ChangePill({ value, className }) {
  const pos = value >= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium tabular-nums",
        pos ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
        className
      ),
      children: [
        pos ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-3 w-3" }),
        Math.abs(value).toFixed(2),
        "%"
      ]
    }
  );
}
const PATTERNS = [
  "Bull Flag",
  "Cup & Handle",
  "Breakout",
  "Double Bottom",
  "Falling Wedge",
  "Ascending Triangle",
  "Consolidation"
];
const EXCHANGES = ["Binance", "Coinbase", "Bybit", "OKX", "Kraken"];
const seeds = [
  ["BTC", "Bitcoin", 96420, 19e11],
  ["ETH", "Ethereum", 3450, 415e9],
  ["SOL", "Solana", 198.4, 95e9],
  ["BNB", "BNB", 642.2, 92e9],
  ["XRP", "Ripple", 2.41, 138e9],
  ["DOGE", "Dogecoin", 0.382, 56e9],
  ["ADA", "Cardano", 1.08, 38e9],
  ["AVAX", "Avalanche", 41.7, 17e9],
  ["LINK", "Chainlink", 22.8, 145e8],
  ["TON", "Toncoin", 5.32, 135e8],
  ["DOT", "Polkadot", 8.94, 129e8],
  ["MATIC", "Polygon", 0.62, 62e8],
  ["ARB", "Arbitrum", 0.95, 41e8],
  ["OP", "Optimism", 2.18, 28e8],
  ["NEAR", "NEAR", 6.42, 71e8],
  ["APT", "Aptos", 12.8, 79e8],
  ["SUI", "Sui", 4.31, 124e8],
  ["INJ", "Injective", 28.4, 27e8],
  ["FET", "Fetch.ai", 1.62, 4e9],
  ["RNDR", "Render", 9.41, 49e8],
  ["TAO", "Bittensor", 482, 41e8],
  ["AGIX", "SingularityNET", 0.82, 11e8],
  ["LDO", "Lido DAO", 2.41, 22e8],
  ["UNI", "Uniswap", 12.4, 75e8],
  ["AAVE", "Aave", 312, 46e8],
  ["ATOM", "Cosmos", 7.91, 31e8],
  ["FIL", "Filecoin", 5.12, 3e9],
  ["IMX", "Immutable", 1.42, 22e8],
  ["SEI", "Sei", 0.51, 27e8],
  ["TIA", "Celestia", 5.81, 29e8]
];
function rand(seed) {
  const x = Math.sin(seed) * 1e4;
  return x - Math.floor(x);
}
seeds.map(([symbol, name, price, marketCap], i) => {
  const r = rand(i + 1);
  const r2 = rand(i + 99);
  const change24h = (r - 0.5) * 18;
  const change7d = (r2 - 0.4) * 32;
  return {
    symbol,
    name,
    price,
    marketCap,
    change24h: +change24h.toFixed(2),
    change7d: +change7d.toFixed(2),
    volume: Math.round(marketCap * (0.03 + r * 0.18)),
    rsi: Math.round(20 + r * 70),
    emaStatus: change24h > 1.5 ? "Bullish" : change24h < -1.5 ? "Bearish" : "Neutral",
    pattern: PATTERNS[Math.floor(r * PATTERNS.length)],
    exchange: EXCHANGES[Math.floor(r2 * EXCHANGES.length)]
  };
});
const formatPrice = (n) => n >= 1 ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : n.toLocaleString("en-US", { maximumFractionDigits: 6 });
const formatCompact = (n) => Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
export {
  ChangePill as C,
  formatCompact as a,
  formatPrice as f,
  marketService as m
};
