import { W as jsxRuntimeExports } from "./server-DmgOPCm4.mjs";
import { u as useQuery } from "./useQuery-D8Q7X-Mg.mjs";
import { P as PageHeader, C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./PageHeader-DfRYcKFV.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-B4SMSDuX.mjs";
import { U as Activity, W as SlidersHorizontal, g as Badge, a as cn$1, c as createLucideIcon, m as marketService } from "./router-ov0HDanu.mjs";
import { C as ChangePill, f as formatPrice, a as formatCompact } from "./coins-BogPyFvB.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const __iconNode$2 = [
  ["path", { d: "M13.744 17.736a6 6 0 1 1-7.48-7.48", key: "bq4yh3" }],
  ["path", { d: "M15 6h1v4", key: "11y1tn" }],
  ["path", { d: "m6.134 14.768.866-.5 2 3.464", key: "17snzx" }],
  ["circle", { cx: "16", cy: "8", r: "6", key: "14bfc9" }]
];
const Coins = createLucideIcon("coins", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
const RECENT_ACTIVITY = [{
  name: "Golden Cross Hunter",
  matches: 7,
  time: "12m ago"
}, {
  name: "RSI Oversold Largecaps",
  matches: 3,
  time: "2h ago"
}, {
  name: "Volume Spike Detector",
  matches: 12,
  time: "Yesterday"
}, {
  name: "Mean Reversion Setup",
  matches: 5,
  time: "5h ago"
}];
function Dashboard() {
  const {
    data: market = []
  } = useQuery({
    queryKey: ["market"],
    queryFn: () => marketService.getAll(),
    refetchInterval: 3e4
    // Refresh every 30 seconds for live feel
  });
  const safeMarket = Array.isArray(market) ? market : [];
  const stats = [{
    label: "Total Coins Scanned",
    value: safeMarket.length > 0 ? safeMarket.length.toLocaleString() : "0",
    icon: Coins,
    accent: "text-primary"
  }, {
    label: "Bullish Trend (EMA)",
    value: safeMarket.filter((c) => c.emaStatus === "Bullish").length.toString(),
    icon: TrendingUp,
    accent: "text-success"
  }, {
    label: "Oversold (RSI < 30)",
    value: safeMarket.filter((c) => c.rsi !== null && c.rsi < 30).length.toString(),
    icon: Activity,
    accent: "text-warning"
  }, {
    label: "High Volatility",
    value: safeMarket.filter((c) => Math.abs(c.change24h) > 5).length.toString(),
    icon: SlidersHorizontal,
    accent: "text-primary"
  }];
  const gainers = [...safeMarket].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
  const losers = [...safeMarket].sort((a, b) => a.change24h - b.change24h).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Dashboard", description: "Live market signals and scanner activity at a glance." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center justify-between p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-2xl font-semibold tabular-nums", children: s.value })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: `h-5 w-5 ${s.accent}` })
    ] }) }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-success" }),
          " Top Gainers (24h)"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: gainers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: c.symbol }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChangePill, { value: c.change24h })
        ] }, c.symbol)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-4 w-4 text-destructive" }),
          " Top Losers (24h)"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: losers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: c.symbol }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChangePill, { value: c.change24h })
        ] }, c.symbol)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Recent Scanner Activity" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: RECENT_ACTIVITY.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: a.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: a.time })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
            a.matches,
            " matches"
          ] })
        ] }, a.name)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Market Overview" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Coin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "24H %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Volume" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Market Cap" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: market.slice(0, 12).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: c.symbol }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right tabular-nums", children: [
            "$",
            formatPrice(c.price)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChangePill, { value: c.change24h }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right tabular-nums text-muted-foreground", children: [
            "$",
            formatCompact(c.volume)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right tabular-nums", children: c.rsi !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn$1("text-xs", c.rsi >= 70 && "text-destructive", c.rsi <= 30 && "text-success"), children: [
            "RSI: ",
            c.rsi.toFixed(2)
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground animate-pulse", children: "N/A" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right tabular-nums text-muted-foreground", children: [
            "$",
            formatCompact(c.marketCap)
          ] })
        ] }, c.symbol)) })
      ] }) }) })
    ] })
  ] });
}
export {
  Dashboard as component
};
