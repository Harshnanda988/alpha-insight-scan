export interface Coin {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  volume: number;
  marketCap: number;
  rsi: number | null;
  emaStatus: "Bullish" | "Bearish" | "Neutral" | "N/A";
  pattern: string;
  exchange: string;
  ema20?: number | null;
  ema50?: number | null;
  ema200?: number | null;
  technicals?: Record<string, any>;
}

const PATTERNS = [
  "Bull Flag",
  "Cup & Handle",
  "Breakout",
  "Double Bottom",
  "Falling Wedge",
  "Ascending Triangle",
  "Consolidation",
];
const EXCHANGES = ["Binance", "Coinbase", "Bybit", "OKX", "Kraken"];

const seeds: Array<[string, string, number, number]> = [
  ["BTC", "Bitcoin", 96420, 1_900_000_000_000],
  ["ETH", "Ethereum", 3450, 415_000_000_000],
  ["SOL", "Solana", 198.4, 95_000_000_000],
  ["BNB", "BNB", 642.2, 92_000_000_000],
  ["XRP", "Ripple", 2.41, 138_000_000_000],
  ["DOGE", "Dogecoin", 0.382, 56_000_000_000],
  ["ADA", "Cardano", 1.08, 38_000_000_000],
  ["AVAX", "Avalanche", 41.7, 17_000_000_000],
  ["LINK", "Chainlink", 22.8, 14_500_000_000],
  ["TON", "Toncoin", 5.32, 13_500_000_000],
  ["DOT", "Polkadot", 8.94, 12_900_000_000],
  ["MATIC", "Polygon", 0.62, 6_200_000_000],
  ["ARB", "Arbitrum", 0.95, 4_100_000_000],
  ["OP", "Optimism", 2.18, 2_800_000_000],
  ["NEAR", "NEAR", 6.42, 7_100_000_000],
  ["APT", "Aptos", 12.8, 7_900_000_000],
  ["SUI", "Sui", 4.31, 12_400_000_000],
  ["INJ", "Injective", 28.4, 2_700_000_000],
  ["FET", "Fetch.ai", 1.62, 4_000_000_000],
  ["RNDR", "Render", 9.41, 4_900_000_000],
  ["TAO", "Bittensor", 482, 4_100_000_000],
  ["AGIX", "SingularityNET", 0.82, 1_100_000_000],
  ["LDO", "Lido DAO", 2.41, 2_200_000_000],
  ["UNI", "Uniswap", 12.4, 7_500_000_000],
  ["AAVE", "Aave", 312, 4_600_000_000],
  ["ATOM", "Cosmos", 7.91, 3_100_000_000],
  ["FIL", "Filecoin", 5.12, 3_000_000_000],
  ["IMX", "Immutable", 1.42, 2_200_000_000],
  ["SEI", "Sei", 0.51, 2_700_000_000],
  ["TIA", "Celestia", 5.81, 2_900_000_000],
];

// deterministic pseudo-random
function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const COINS: Coin[] = seeds.map(([symbol, name, price, marketCap], i) => {
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
    exchange: EXCHANGES[Math.floor(r2 * EXCHANGES.length)],
  };
});

export const formatPrice = (n: number) =>
  n >= 1
    ? n.toLocaleString("en-US", { maximumFractionDigits: 2 })
    : n.toLocaleString("en-US", { maximumFractionDigits: 6 });

export const formatCompact = (n: number) =>
  Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
